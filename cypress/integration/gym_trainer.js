context('GymTrainer', () => {
    before(() => {
        cy.login('Administrator', 'admin');
        cy.visit('/desk');
    });

    it('Creates a new gym trainer', () => {
        cy.visit('/app/gym-trainer/new-gym-trainer-1');
        cy.fill_field('trainer_name', 'Test trainer', 'Data').blur();
        cy.get('.page-title').should('contain', 'Not Saved');
        cy.get('.primary-action').click();
        cy.visit('/desk#List/GymTrainer');
        cy.location('hash').should('eq', '/app/gymtrainer');
        cy.get('.list-row').should('contain', 'test trainer');
    });

    it('Deletes ', () => {
        cy.visit('/app/gym-trainer');
		cy.click_listview_row_item_with_text('Test trainer');
        cy.get('.menu-btn-group:visible > .btn').click();
		cy.get('.menu-btn-group:visible > .dropdown-menu > li > .dropdown-item').contains('Delete').click();
		cy.get('.modal-footer:visible > .standard-actions > .btn-primary').click();
    });

});