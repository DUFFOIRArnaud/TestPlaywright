//Cette page de test est conçue pour vérifier le processus d'ouverture d'un nouveau compte bancaire et le transfert de fonds entre les comptes sur le site Parabank.

import { test, Page, expect } from '@playwright/test';
import { OpenNewAccountPage } from '../pages/OpenNewAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';

let newAccountId: string | null = null;
let fromAccountId: string | null = null;

test.beforeEach(async ({page}) => {
  // Naviguer vers la page d'accueil de Parabank avant chaque test
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
});

// Test d'ouverture d'un nouveau compte bancaire
test('Open a new bank account', async ({ page }) => {
  const accountPage = new OpenNewAccountPage(page);
  //Utilisation des fonctions du fichier OpenNewAccountPage.
  await accountPage.goTo();
  await accountPage.selectAccountType('1');
  await page.waitForLoadState('networkidle');
  await accountPage.submitAccountForm();
  newAccountId = await accountPage.getNewAccountId();
  expect(newAccountId).not.toBeNull();
  await accountPage.verifyAccountCreation(newAccountId!);
});

// Test de transfert de fonds entre comptes bancaires
test('Transfer funds between own banking accounts', async ({ page }) => {
  //Vérifier que l'ID du nouveau compte est disponible avant de procéder au transfert de fonds.
  test.skip(!newAccountId, 'New account ID is required for this test');
  
  //Utilisation des fonctions du fichier TransferFundsPage 
  const transferPage = new TransferFundsPage(page);
  await transferPage.goTo();
  let transferAmount = '100';
  fromAccountId = await transferPage.getFromAccountId();
  expect(fromAccountId).not.toBeNull();
  await transferPage.fillTransferDetails(transferAmount, newAccountId!);
  await page.waitForLoadState('networkidle');
  await transferPage.submitTransfer();
  await page.waitForLoadState('networkidle');
  await transferPage.verifyTransferSuccess(transferAmount, fromAccountId!, newAccountId!);
});