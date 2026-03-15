//Cette page de test est conçue pour vérifier le processus d'inscription sur le site Parabank. 
//Elle utilise Playwright pour automatiser les interactions avec la page d'inscription, en générant des données aléatoires pour les champs du formulaire. 
//Le test tente de s'inscrire jusqu'à trois fois en cas d'échec, et enregistre l'état d'authentification dans un fichier JSON si l'inscription réussit.

import { test, Page, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { fa, faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs';

// Chemin vers le fichier d'authentification
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

// Avant chaque test, réinitialiser le fichier d'authentification pour garantir un état propre
test.beforeEach(async ({ page }) => {
  const authFile = path.join(__dirname, '../playwright/.auth/user.json');
  if (fs.existsSync(authFile)) {
    fs.writeFileSync(authFile, '{}', 'utf-8');
    console.log('Authentication file reset successfully.');
  }
});

// Test d'inscription avec gestion des tentatives et enregistrement de l'état d'authentification
test('Register at Parabank', async ({ page }) => {
  const MAX_REGISTRATION_ATTEMPTS = 3;
  const PASSWORD = faker.internet.password();
  const registerPage = new RegisterPage(page);

  for (let i = 0; i < MAX_REGISTRATION_ATTEMPTS; i++) {
    let username = faker.internet.username();
    //Utilisation des foctions du fichier RegisterPage pour naviguer vers la page d'inscription, remplir le formulaire avec des données aléatoires, soumettre le formulaire et vérifier la création du compte.
    await registerPage.goTo();
    await registerPage.fillForm();
    await registerPage.fillCredentials(username, PASSWORD);
    await registerPage.submitForm();
    //Attendre que la page soit complètement chargée avant de vérifier la création du compte.
    await page.waitForLoadState('networkidle');

    try {
      //Vérifier que le compte a été créé avec succès via la fonction verifyAccountCreation.
      await registerPage.verifyAccountCreation(username);
      await page.context().storageState({ path: authFile });
      break;
    } catch (error) {
      const err = error as Error;
      console.log(`Attempt ${i + 1} failed: ${err.message}`);
      if (i === MAX_REGISTRATION_ATTEMPTS - 1) {
        throw error; // Lancer l'erreur après la dernière tentative échouée
      }
    }
  }
});