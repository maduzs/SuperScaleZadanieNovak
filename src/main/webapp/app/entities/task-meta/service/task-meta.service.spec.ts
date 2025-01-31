import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITaskMeta } from '../task-meta.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../task-meta.test-samples';

import { TaskMetaService } from './task-meta.service';

const requireRestSample: ITaskMeta = {
  ...sampleWithRequiredData,
};

describe('TaskMeta Service', () => {
  let service: TaskMetaService;
  let httpMock: HttpTestingController;
  let expectedResult: ITaskMeta | ITaskMeta[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TaskMetaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TaskMeta', () => {
      const taskMeta = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(taskMeta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TaskMeta', () => {
      const taskMeta = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(taskMeta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TaskMeta', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TaskMeta', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TaskMeta', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTaskMetaToCollectionIfMissing', () => {
      it('should add a TaskMeta to an empty array', () => {
        const taskMeta: ITaskMeta = sampleWithRequiredData;
        expectedResult = service.addTaskMetaToCollectionIfMissing([], taskMeta);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(taskMeta);
      });

      it('should not add a TaskMeta to an array that contains it', () => {
        const taskMeta: ITaskMeta = sampleWithRequiredData;
        const taskMetaCollection: ITaskMeta[] = [
          {
            ...taskMeta,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTaskMetaToCollectionIfMissing(taskMetaCollection, taskMeta);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TaskMeta to an array that doesn't contain it", () => {
        const taskMeta: ITaskMeta = sampleWithRequiredData;
        const taskMetaCollection: ITaskMeta[] = [sampleWithPartialData];
        expectedResult = service.addTaskMetaToCollectionIfMissing(taskMetaCollection, taskMeta);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(taskMeta);
      });

      it('should add only unique TaskMeta to an array', () => {
        const taskMetaArray: ITaskMeta[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const taskMetaCollection: ITaskMeta[] = [sampleWithRequiredData];
        expectedResult = service.addTaskMetaToCollectionIfMissing(taskMetaCollection, ...taskMetaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const taskMeta: ITaskMeta = sampleWithRequiredData;
        const taskMeta2: ITaskMeta = sampleWithPartialData;
        expectedResult = service.addTaskMetaToCollectionIfMissing([], taskMeta, taskMeta2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(taskMeta);
        expect(expectedResult).toContain(taskMeta2);
      });

      it('should accept null and undefined values', () => {
        const taskMeta: ITaskMeta = sampleWithRequiredData;
        expectedResult = service.addTaskMetaToCollectionIfMissing([], null, taskMeta, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(taskMeta);
      });

      it('should return initial array if no TaskMeta is added', () => {
        const taskMetaCollection: ITaskMeta[] = [sampleWithRequiredData];
        expectedResult = service.addTaskMetaToCollectionIfMissing(taskMetaCollection, undefined, null);
        expect(expectedResult).toEqual(taskMetaCollection);
      });
    });

    describe('compareTaskMeta', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTaskMeta(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 30055 };
        const entity2 = null;

        const compareResult1 = service.compareTaskMeta(entity1, entity2);
        const compareResult2 = service.compareTaskMeta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 30055 };
        const entity2 = { id: 5170 };

        const compareResult1 = service.compareTaskMeta(entity1, entity2);
        const compareResult2 = service.compareTaskMeta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 30055 };
        const entity2 = { id: 30055 };

        const compareResult1 = service.compareTaskMeta(entity1, entity2);
        const compareResult2 = service.compareTaskMeta(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
