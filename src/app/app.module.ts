import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from "@clr/angular";
import { SearchResultComponent } from './search-result/search-result.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { BestDealComponent } from './best-deal/best-deal.component';
import { CartComponent } from './cart/cart.component';
import { StoresComponent } from './stores/stores.component';
import { FaqBoardComponent } from './faq-board/faq-board.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopComponent } from './shop/shop.component';
import { CdsModule } from '@cds/angular';
import { ClarityIcons, shoppingCartIcon, searchIcon, cogIcon, happyFaceIcon, storeIcon, pinboardIcon } from '@cds/core/icon';

@NgModule({
  declarations: [
    AppComponent,
    SearchResultComponent,
    AccountSettingComponent,
    BestDealComponent,
    CartComponent,
    StoresComponent,
    FaqBoardComponent,
    ShopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ClarityModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
