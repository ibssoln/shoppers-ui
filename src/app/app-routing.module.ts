import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultComponent } from './search-result/search-result.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { BestDealComponent } from './best-deal/best-deal.component';
import { CartComponent } from './cart/cart.component';
import { StoresComponent } from './stores/stores.component';
import { FaqBoardComponent } from './faq-board/faq-board.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  { path: '', redirectTo: '/stores', pathMatch: 'full' },
  { path: 'searchResult', component: SearchResultComponent },
  { path: 'accountSetting', component: AccountSettingComponent },
  { path: 'stores', component: StoresComponent },
  { path: 'bestDeal', component: BestDealComponent },
  { path: 'cart', component: CartComponent },
  { path: 'faqBoard', component: FaqBoardComponent },
  { path: 'shop', component: ShopComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
