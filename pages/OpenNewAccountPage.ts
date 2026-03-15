// Page Object Model pour la page d'ouverture de compte de Parabank
import { Locator, Page, expect } from "@playwright/test";

export class OpenNewAccountPage {
    readonly page: Page;
    readonly openNewAccountLink: Locator;
    readonly accountTypeSelect: Locator;
    readonly openNewAccountButton: Locator;
    readonly newAccountId: Locator;
    readonly accountOpenedHeading: Locator;
    readonly successMessage: Locator;
    readonly newAccountMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        //Initialisation des éléments de la page d'ouverture de compte. 
        this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account' });
        this.accountTypeSelect = page.locator('#type');
        this.openNewAccountButton = page.getByRole('button', { name: 'Open New Account' });
        this.newAccountId = page.locator('#newAccountId');
        this.accountOpenedHeading = page.getByRole('heading', { name: 'Account Opened!' });
        this.successMessage = page.getByText('Congratulations, your account is now open.');
        this.newAccountMessage = page.locator('#openAccountResult');
    } 
    
    //La méthode goTo() navigue vers la page d'ouverture de compte en cliquant sur le lien "Open New Account".
    async goTo() {
        await this.openNewAccountLink.click();
    }

    //La méthode selectAccountType() sélectionne le type de compte à ouvrir dans le menu déroulant.
    async selectAccountType(accountType: string) {
        await this.accountTypeSelect.selectOption(accountType);
    }

    // La méthode submitAccountForm() clique sur le bouton "Open New Account" pour soumettre le formulaire d'ouverture de compte.
    async submitAccountForm() {
        await this.openNewAccountButton.click();
    }

    //La méthode getNewAccountId() récupère l'ID du nouveau compte créé en extrayant le texte de l'élément qui affiche l'ID du compte.
    async getNewAccountId() {
        await this.newAccountId.waitFor();
        return await this.newAccountId.textContent();
    }

    //La méthode verifyAccountCreation() vérifie que le compte a été créé avec succès :
    // - en vérifiant que le message de confirmation de création de compte est affiché 
    // - et que l'ID du nouveau compte est présent dans le message de résultat.
    async verifyAccountCreation(newAccountId : string) {
        await expect(this.accountOpenedHeading).toBeVisible();
        await expect(this.successMessage).toBeVisible();
        const newAccountMessageText = await this.newAccountMessage.textContent();
        await expect(newAccountMessageText).toContain(newAccountId);
    }
}