// Page Object Model pour la page d'inscription de Parabank
import { Locator, Page, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

//Cette classe représente la page d'inscription de Parabank et fournit des méthodes pour :
//  - interagir avec les éléments de la page, remplir le formulaire d'inscription, 
//  - soumettre le formulaire 
//  - vérifier la création du compte ou les erreurs d'inscription.
export class RegisterPage {

    //Déclaration des éléments de la page d'inscription en tant que propriétés de la classe.
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator
    readonly streetInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator
    readonly zipCodeInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly ssnInput: Locator;
    readonly usernameInput: Locator
    readonly passwordInput: Locator;
    readonly repeatedPasswordInput: Locator;
    readonly registerButton: Locator;
    //Erreurs d'inscription
    readonly firstNameError: Locator;
    readonly lastNameError: Locator;
    readonly adressError: Locator;
    readonly cityError: Locator
    readonly stateError: Locator;
    readonly zipCodeError: Locator
    readonly ssnError: Locator;
    readonly usernameError: Locator;
    readonly passwordError: Locator;
    readonly repeatedPasswordError: Locator;
    readonly userAlreadyExistsError: Locator;

    //Le constructeur initialise les propriétés de la classe en utilisant les sélecteurs appropriés pour localiser les éléments de la page d'inscription.
    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('#customer\\.firstName');
        this.lastNameInput = page.locator('#customer\\.lastName');
        this.streetInput = page.locator('#customer\\.address\\.street');
        this.cityInput = page.locator('#customer\\.address\\.city');
        this.stateInput = page.locator('#customer\\.address\\.state');
        this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');
        this.phoneNumberInput = page.locator('#customer\\.phoneNumber');
        this.ssnInput = page.locator('#customer\\.ssn');
        this.usernameInput = page.locator('#customer\\.username');
        this.passwordInput = page.locator('#customer\\.password');
        this.repeatedPasswordInput = page.locator('#repeatedPassword');
        this.registerButton = page.getByRole('button', { name: 'Register' });

        //Erreurs d'inscription
        this.firstNameError = page.locator('#customer\\.firstName\\.errors');
        this.lastNameError = page.locator('#customer\\.lastName\\.errors');
        this.adressError = page.locator('#customer\\.address\\.street\\.errors');
        this.cityError = page.locator('#customer\\.address\\.city\\.errors');
        this.stateError = page.locator('#customer\\.address\\.state\\.errors');
        this.zipCodeError = page.locator('#customer\\.address\\.zipCode\\.errors');
        this.ssnError = page.locator('#customer\\.ssn\\.errors');
        this.usernameError = page.locator('#customer\\.username\\.errors');
        this.passwordError = page.locator('#customer\\.password\\.errors');
        this.repeatedPasswordError = page.locator('#repeatedPassword\\.errors');
        this.userAlreadyExistsError = page.locator('#customer\\.username\\.errors');
    } 

    //La méthode goTo() navigue vers la page d'inscription de Parabank.
    async goTo() {
        await this.page.goto('https://parabank.parasoft.com/parabank/register.htm');
    }

    //La méthode fillForm() remplit le formulaire d'inscription avec des données générées aléatoirement à l'aide de la bibliothèque Faker.
    async fillForm() {
        await this.firstNameInput.fill(faker.person.firstName());
        await this.lastNameInput.fill(faker.person.lastName());
        await this.streetInput.fill(faker.location.streetAddress());
        await this.cityInput.fill(faker.location.city());
        await this.stateInput.fill(faker.location.state());
        await this.zipCodeInput.fill(faker.location.zipCode());
        await this.phoneNumberInput.fill(faker.phone.number());
        await this.ssnInput.fill(faker.string.numeric(9));
    }

    //La méthode fillCredentials() remplit les champs de nom d'utilisateur et de mot de passe du formulaire d'inscription.
    async fillCredentials(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.repeatedPasswordInput.fill(password);
    }

    //La méthode submitForm() clique sur le bouton d'inscription pour soumettre le formulaire.
    async submitForm() {
        await this.registerButton.click();
    }

    //La méthode isErrorDisplayed() vérifie si un message d'erreur indiquant que le nom d'utilisateur existe déjà est affiché sur la page.
    async isErrorDisplayed() {
        await this.userAlreadyExistsError.waitFor();
        return await this.userAlreadyExistsError.isVisible();
    }

    //La méthode verifyAccountCreation() vérifie que le compte a été créé avec succès.
    //Elle vérifie que le message de bienvenue contient le nom d'utilisateur et que le message de succès indique que le compte a été créé et que l'utilisateur est connecté. 
    async verifyAccountCreation(username: string) {
        
        const headerText = await this.page.locator('h1').textContent();
        const rightPanelText = await this.page.locator('#rightPanel').textContent();

        if(headerText && rightPanelText) {
            await expect(headerText.includes('Welcome ' + username)).toBe(true);
            await expect(rightPanelText.includes('Your account was created successfully. You are now logged in.')).toBe(true);
        }
    }

    async verifyErrorMessages() {
        await expect(this.firstNameError).toBeVisible();
        await expect(this.lastNameError).toBeVisible();
        await expect(this.adressError).toBeVisible();
        await expect(this.cityError).toBeVisible();
        await expect(this.stateError).toBeVisible();
        await expect(this.zipCodeError).toBeVisible();
        await expect(this.ssnError).toBeVisible();
        await expect(this.usernameError).toBeVisible();
        await expect(this.passwordError).toBeVisible();
        await expect(this.repeatedPasswordError).toBeVisible();
    }
}