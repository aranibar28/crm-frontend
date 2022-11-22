import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractInscriptionComponent } from './contract-inscription/contract-inscription.component';
import { CreateInscriptionComponent } from './create-inscription/create-inscription.component';
import { DetailsInscriptionComponent } from './details-inscription/details-inscription.component';
import { IndexInscriptionComponent } from './index-inscription/index-inscription.component';
import { PaymentInscriptionComponent } from './payment-inscription/payment-inscription.component';
import { SurveyInscriptionComponent } from './survey-inscription/survey-inscription.component';

const routes: Routes = [
  { path: '', component: IndexInscriptionComponent },
  { path: 'create', component: CreateInscriptionComponent },
  { path: 'details/:id', component: DetailsInscriptionComponent },
  { path: 'contract/:id', component: ContractInscriptionComponent },
  { path: 'payment/:id', component: PaymentInscriptionComponent },
  { path: 'survey/:id', component: SurveyInscriptionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscriptionsRoutingModule {}
