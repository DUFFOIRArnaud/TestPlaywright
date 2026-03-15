//Cette page de test est conçue pour vérifier les messages d'erreur d'authentification sur le site Parabank.

import { test, Page, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';

// Test pour vérifier les messages d'erreur d'authentification
test('Authentication error messages on Parabank', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goTo();
    await registerPage.submitForm();
    await registerPage.verifyErrorMessages();
});
