import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITaskConfig } from '../task-config.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../task-config.test-samples';

import { TaskConfigService } from './task-config.service';

const requireRestSample: ITaskConfig = {
  ...sampleWithRequiredData,
};

describe('TaskConfig Service', () => {
  let service: TaskConfigService;
  let httpMock: HttpTestingController;
  let expectedResult: ITaskConfig | ITaskConfig[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TaskConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TaskConfig', () => {
      const taskConfig = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(taskConfig).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TaskConfig', () => {
      const taskConfig = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(taskConfig).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TaskConfig', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TaskConfig', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TaskConfig', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTaskConfigToCollectionIfMissing', () => {
      it('should add a TaskConfig to an empty array', () => {
        const taskConfig: ITaskConfig = sampleWithRequiredData;
        expectedResult = service.addTaskConfigToCollectionIfMissing([], taskConfig);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(taskConfig);
      });

      it('should not add a TaskConfig to an array that contains it', () => {
        const taskConfig: ITaskConfig = sampleWithRequiredData;
        const taskConfigCollection: ITaskConfig[] = [
          {
            ...taskConfig,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTaskConfigToCollectionIfMissing(taskConfigCollection, taskConfig);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TaskConfig to an array that doesn't contain it", () => {
        const taskConfig: ITaskConfig = sampleWithRequiredData;
        const taskConfigCollection: ITaskConfig[] = [sampleWithPartialData];
        expectedResult = service.addTaskConfigToCollectionIfMissing(taskConfigCollection, taskConfig);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(taskConfig);
      });

      it('should add only unique TaskConfig to an array', () => {
        const taskConfigArray: ITaskConfig[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const taskConfigCollection: ITaskConfig[] = [sampleWithRequiredData];
        expectedResult = service.addTaskConfigToCollectionIfMissing(taskConfigCollection, ...taskConfigArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const taskConfig: ITaskConfig = sampleWithRequiredData;
        const taskConfig2: ITaskConfig = sampleWithPartialData;
        expectedResult = service.addTaskConfigToCollectionIfMissing([], taskConfig, taskConfig2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(taskConfig);
        expect(expectedResult).toContain(taskConfig2);
      });

      it('should accept null and undefined values', () => {
        const taskConfig: ITaskConfig = sampleWithRequiredData;
        expectedResult = service.addTaskConfigToCollectionIfMissing([], null, taskConfig, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(taskConfig);
      });

      it('should return initial array if no TaskConfig is added', () => {
        const taskConfigCollection: ITaskConfig[] = [sampleWithRequiredData];
        expectedResult = service.addTaskConfigToCollectionIfMissing(taskConfigCollection, undefined, null);
        expect(expectedResult).toEqual(taskConfigCollection);
      });
    });

    describe('compareTaskConfig', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTaskConfig(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
        const entity2 = null;

        const compareResult1 = service.compareTaskConfig(entity1, entity2);
        const compareResult2 = service.compareTaskConfig(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
        const entity2 = { id: '9a4eec8b-874c-4eaf-b676-38262fa92c4a' };

        const compareResult1 = service.compareTaskConfig(entity1, entity2);
        const compareResult2 = service.compareTaskConfig(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };
        const entity2 = { id: 'b1b9c7bd-c8cf-4371-9dc1-8a53a2e1c92a' };

        const compareResult1 = service.compareTaskConfig(entity1, entity2);
        const compareResult2 = service.compareTaskConfig(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
