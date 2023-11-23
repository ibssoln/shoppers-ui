// const {v4: uuidv4} = require('uuid');
// const Agent = require('agentkeepalive');
// const HttpsAgent = require('agentkeepalive').HttpsAgent;

const disableProxy = function(){
	process.env['NO_PROXY'] = '';
	process.env['HTTP_PROXY'] = '';
	process.env['HTTPS_PROXY'] = '';
}

const httpConnectionOptions = {
	maxSockets: 100,
	maxFreeSockets: 10,
	timeout: 60000,
	freeSocketTimeout: 30000,
}

// const keepaliveAgentHttp = new Agent(httpConnectionOptions);
// const keepaliveAgentHttps = new HttpsAgent(httpConnectionOptions);

const getBearerToken = async function(){
	const options = {
		method: 'POST',
		headers: {'content-type':'application/json'},
		data: {
			client_id: 'CLIENT_ID',
			client_secret: 'CLIENT_SECRET',
			grant_type: 'GRANT_TYPE'
		},
		url: 'http://localhost:8444/fortress'
	};
	const res = await axios(options);
	const token = res?.data?.access_token;
	return 'Bearer '+token;
}

const buildHeader = async function(contentType){
	let headers = {};
	headers['Authoriation'] = await getBearerToken();
	headers['LOG-ID'] = uuidv4();
	headers['USERID'] = APP_ID;
	headers['USERID-TYPE'] = APP_ID_TYPE;
	headers['Content-Type'] = contentType == null ? 'applicaion/json' : contentType;
	return headers;
}	

const getUserActiveRole = async function(contentType, userId){
	let activeRole = new ActiveUserRole();
	const roles = await getRoles(contentType, userId);
	if(!!roles?.roleList && roles.roleList.length>0){
		activeRole = getActiveRole(roles.roleList);
	}
	return activeRole;
}

const getRoles = async function(contentType, userId){
	const ROLE_ENDPOINT = `http://localhost:8444/domain/${APP_ID}/users/${userId}/roles`;
	const httpOptions = createRequestOptions('GET', ENDPOINT, [], await buildHeader(contentType));
	const results = await axios(httpOptions);
	return results?.data;
}

const getActiveRole = function(roles){
	let activeRole = new ActiveUserRole();
	let userRoles = [];
	if(roles & roles.length>0){
		userRoles = getActiveRoleByRule(roles);
	}
	if(!!userRoles && userRoles.length>0){
		activeRole.role = userRoles[0].role;
		userRoles.forEach(user => {
			activeRole.context.push(user.context);
		});
	}
	return activeRole;
}

const getActiveRoleByRule = function(roles){
	for(let check of rolePrecedence){
		let domnantRoles = roles.filter(role => role.role == check);
		if(dominantRoles && dominantRoles.length>0){
			return dominantRoles;
		}
	}
	return [];
}

const getUserActivePolicies = async function(contentType, userId, activeRole){
	let activePolicies = [];
	let contextIds = new Set();
	activeRole.context.forEach(obj => {
		contextIds.add(obj.contextId);
	});
	let policiesRegistry = new Set();
	for(const contextId of contextIds){
		const policies = await getPolicies(contentType, userId, activeRole.role, contextId);
		if(!!policies?.permissionList && policies.permissionList.length>0){
			activePolicies = addUniqueActivePolicies(policies.permissionList, policiesRegistry, activePolicies);
		}
	}
	return activePolicies;
}

const getPolicies = async function(contentType, userId, roleName, contextId){
	const POLICY_ENDPOINT = 'http://localhost:8444/${APP_ID}/users/${userId}/roles/${roleName}/role?contextId=${contextId}';
	const httpOptions = createRequestOptions('GET', POLICY_ENDPOINT, [], await buildHeader(contentType));
	const results = await axios(httpOptions);
	return results?.data;
}

const addUniqueActivePolicies = function(policies, policiesRegistry, activePolicies){
	let results = [...activePolicies];
	policies.forEach((pol) => {
		if(pol.status=='PERMIT' && !policiesRegistry.has(pol.name)){
			policiesRegistry.add(pol.name);
			results.push(new ActiveUserPolicy(pol.name, pol.instance));
		}
	});
	return results;
}

exports.getRolesAndPolicies = async (app, config) => {
	let serId = req?.body?.userId;
	if(!!userId){
		disableProxy();
		let response = new User(userId, new ActiveUserRole(), []);
		let activeRole = new ActiveRole();
		let activePolicies = [];
		try{
			const contentType = req.header('Content-Type');
			if(userId != ''){
				activeRole = await getUserActiveRole(contentType, userId);
				if(!!activeRole?.role && activeRole.role != '' && activeRole?.content.length>0){
					activePolicies = await getUserActivePolicies(contentType, userId, activeRole);		
				}
			}
			response = new User(userId, activeRole, activePolicies);
		}catch(err){
			if(!!err.response){
				if(err.response.status == 404){
					response = new User(userId, new ActiveUserRole(), []);
				}else{
					res.status(err.response.status);
					response = err.response.data;
				}
			}else if (!!err.errors){
				response = err;
			}
		}
		res.send(response);
	}else{
		res.status(400);
		res.send('User Id is required.');
	}

};

class Role{
	role = '';
	context = new RoleContext();
}

class RoleContext{
	contextId = '';
	contextList = [];
}

class User{
	userId = '';
	activeRole = new ActiveUserRole();
	activePolicies = [];
	constructor(userId, activeRole, activePolicies){
		this.userId = userId;
		this.activeRole = actveRole;
		this.activePolicies = activePolicies
	}
}

class ActiveUserRole{
	role = '';
	context = [];
}

class ActiveUserPolicy{
	code = '';
	group = '';
	constructor(code, group){
		this.code = code;
		this.group = group;
	}
}
