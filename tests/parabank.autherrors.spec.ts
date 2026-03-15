//Cette page de test est conçue pour vérifier les messages d'erreur d'authentification sur le site Parabank.

import { test, Page, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import path from 'path';
import fs from 'fs';

// Avant chaque test, réinitialiser le fichier d'authentification pour garantir un état propre
test.beforeEach(async ({ page }) => {
  const authFile = path.join(__dirname, '../playwright/.auth/user.json');
  if (fs.existsSync(authFile)) {
    fs.writeFileSync(authFile, '{}', 'utf-8');
    console.log('Authentication file reset successfully.');
  }
});

// Test pour vérifier les messages d'erreur d'authentification
test('Authentication error messages on Parabank', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goTo();
    await registerPage.submitForm();
    await registerPage.verifyErrorMessages();
});
