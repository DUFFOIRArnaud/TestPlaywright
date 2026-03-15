// Page Object Model pour la page de transfert de fonds de Parabank
import { Locator, Page, expect } from "@playwright/test";

export class TransferFundsPage {
    readonly page: Page;
    readonly transferFundsLink: Locator;
    readonly amountInput: Locator
    readonly fromAccountSelect: Locator;
    readonly toAccountSelect: Locator;
    readonly transferButton: Locator;
    readonly transferCompleteHeading: Locator;
    readonly transferSuccessMessage: Locator;
    readonly transferSuccessDetails: Locator;

    constructor(page: Page) {
        this.page = page;
        //Initialisation des éléments de la page de transfert de fonds.
        //Le lien "Transfer Funds" est localisé dans le panneau de gauche.
        this.transferFundsLink = page.locator('#leftPanel').getByRole('link', { name: 'Transfer Funds' });
        this.amountInput = page.locator('#amount');
        this.fromAccountSelect = page.locator('#fromAccountId');
        this.toAccountSelect = page.locator('#toAccountId');
        this.transferButton = page.getByRole('button', { name: 'Transfer' });
        this.transferCompleteHeading = page.getByRole('heading', { name: 'Transfer Complete!' })
        //Les messages de succès sont localisés en utilisant des expressions régulières.
        this.transferSuccessMessage = page.getByText(/has been transferred from account/);
        this.transferSuccessDetails = page.getByText(/Account Activity/);
    }

    //La méthode goTo() navigue vers la page de transfert de fonds.
    async goTo() {
        await this.transferFundsLink.click();
    }   

    //La méthode fillTransferDetails() remplit les détails du transfert de fonds, y compris le montant à transférer, le compte source et le compte de destination.
    async fillTransferDetails(amount: string, toAccountId: string) {
        await this.amountInput.fill(amount);
        await this.fromAccountSelect.selectOption({ index : 0});
        await this.toAccountSelect.selectOption(toAccountId);
    }

    //La méthode submitTransfer() clique sur le bouton "Transfer" pour soumettre le formulaire de transfert de fonds.
    async submitTransfer() {
        await this.transferButton.click();
    }

    //La méthode getFromAccountId() récupère l'ID du compte source sélectionné en extrayant le texte de l'option sélectionnée dans le menu déroulant "From Account".
    async getFromAccountId() {
        await this.fromAccountSelect.waitFor();
        return await this.fromAccountSelect.locator('option:checked').textContent();
    }

    //La méthode verifyTransferSuccess() vérifie que le transfert de fonds a été effectué avec succès en vérifiant:
    // - que le message de confirmation de transfert est affiché 
    // - et que les détails du transfert sont corrects.
    async verifyTransferSuccess(amount: string, fromAccountId: string, toAccountId: string) {
        await expect(this.transferCompleteHeading).toContainText('Transfer Complete!');
        await expect(this.transferSuccessMessage).toContainText(`$${amount}.00 has been transferred from account #${fromAccountId} to account #${toAccountId}.`);
        await expect(this.transferSuccessDetails).toContainText('See Account Activity for more details.');
    }
}
