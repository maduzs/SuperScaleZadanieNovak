import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('TaskConfig e2e test', () => {
  const taskConfigPageUrl = '/task-config';
  const taskConfigPageUrlPattern = new RegExp('/task-config(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const taskConfigSample = { type: 'VACUUM_CLEAN' };

  let taskConfig;
  let taskMeta;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/task-metas',
      body: { name: 'urban', type: 'DATE' },
    }).then(({ body }) => {
      taskMeta = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/task-configs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/task-configs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/task-configs/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/task-metas', {
      statusCode: 200,
      body: [taskMeta],
    });
  });

  afterEach(() => {
    if (taskConfig) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/task-configs/${taskConfig.id}`,
      }).then(() => {
        taskConfig = undefined;
      });
    }
  });

  afterEach(() => {
    if (taskMeta) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/task-metas/${taskMeta.id}`,
      }).then(() => {
        taskMeta = undefined;
      });
    }
  });

  it('TaskConfigs menu should load TaskConfigs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('task-config');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TaskConfig').should('exist');
    cy.url().should('match', taskConfigPageUrlPattern);
  });

  describe('TaskConfig page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(taskConfigPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TaskConfig page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/task-config/new$'));
        cy.getEntityCreateUpdateHeading('TaskConfig');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskConfigPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/task-configs',
          body: {
            ...taskConfigSample,
            metas: taskMeta,
          },
        }).then(({ body }) => {
          taskConfig = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/task-configs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/task-configs?page=0&size=20>; rel="last",<http://localhost/api/task-configs?page=0&size=20>; rel="first"',
              },
              body: [taskConfig],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(taskConfigPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TaskConfig page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('taskConfig');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskConfigPageUrlPattern);
      });

      it('edit button click should load edit TaskConfig page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TaskConfig');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskConfigPageUrlPattern);
      });

      it('edit button click should load edit TaskConfig page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TaskConfig');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskConfigPageUrlPattern);
      });

      it('last delete button click should delete instance of TaskConfig', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('taskConfig').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', taskConfigPageUrlPattern);

        taskConfig = undefined;
      });
    });
  });

  describe('new TaskConfig page', () => {
    beforeEach(() => {
      cy.visit(`${taskConfigPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TaskConfig');
    });

    it('should create an instance of TaskConfig', () => {
      cy.get(`[data-cy="type"]`).select('WASH_DISHES');

      cy.get(`[data-cy="metas"]`).select([0]);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        taskConfig = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', taskConfigPageUrlPattern);
    });
  });
});
