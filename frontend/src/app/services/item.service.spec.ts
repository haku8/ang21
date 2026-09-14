import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';
import { ItemService } from './item.service';
import { Item } from '../models/item.model';
import { GET_ITEMS, CREATE_ITEM, UPDATE_ITEM, DELETE_ITEM } from '../graphql/item.graphql';

type SpyObj<T> = T & { [K in keyof T]: jasmine.Spy };

describe('ItemService', () => {
  let service: ItemService;
  let apolloSpy: SpyObj<Apollo>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Apollo', ['watchQuery', 'mutate']);

    TestBed.configureTestingModule({
      providers: [
        ItemService,
        { provide: Apollo, useValue: spy }
      ]
    });

    service = TestBed.inject(ItemService);
    apolloSpy = TestBed.inject(Apollo) as SpyObj<Apollo>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should return items from GraphQL query', (done) => {
      const mockItems: Item[] = [
        { id: '1', name: 'Item 1', text1: 'Text 1', text2: 'Text 2' },
        { id: '2', name: 'Item 2', text1: null, text2: null }
      ];

      const mockWatchQuery = {
        valueChanges: of({
          data: { items: mockItems }
        })
      };

      apolloSpy.watchQuery.and.returnValue(mockWatchQuery as any);

      service.getItems().subscribe(items => {
        expect(items).toEqual(mockItems);
        expect(apolloSpy.watchQuery).toHaveBeenCalledWith({
          query: GET_ITEMS
        });
        done();
      });
    });
  });

  describe('loadItems', () => {
    it('should load items and update signals', (done) => {
      const mockItems: Item[] = [
        { id: '1', name: 'Item 1', text1: 'Text 1', text2: 'Text 2' }
      ];

      const mockWatchQuery = {
        valueChanges: of({
          data: { items: mockItems }
        })
      };

      apolloSpy.watchQuery.and.returnValue(mockWatchQuery as any);

      service.loadItems();

      setTimeout(() => {
        expect(service.itemsSignal()).toEqual(mockItems);
        expect(service.loadingSignal()).toBe(false);
        expect(service.errorSignal()).toBeNull();
        done();
      }, 0);
    });

    it('should handle error and update error signal', (done) => {
      const mockWatchQuery = {
        valueChanges: throwError(() => new Error('Network error'))
      };

      apolloSpy.watchQuery.and.returnValue(mockWatchQuery as any);

      service.loadItems();

      setTimeout(() => {
        expect(service.loadingSignal()).toBe(false);
        expect(service.errorSignal()).toBe('Fehler beim Laden der Daten');
        done();
      }, 0);
    });
  });

  describe('createItem', () => {
    it('should create item and return observable', (done) => {
      const mockItem: Item = {
        id: '1',
        name: 'New Item',
        text1: 'Text 1',
        text2: 'Text 2'
      };

      const mockMutate = {
        mutate: of({
          data: { createItem: mockItem }
        })
      };

      apolloSpy.mutate.and.returnValue(mockMutate.mutate as any);

      service.createItem('New Item', 'Text 1', 'Text 2').subscribe(result => {
        expect(result).toEqual(mockItem);
        expect(apolloSpy.mutate).toHaveBeenCalledWith({
          mutation: CREATE_ITEM,
          variables: { name: 'New Item', text1: 'Text 1', text2: 'Text 2' },
          refetchQueries: [{ query: GET_ITEMS }]
        });
        done();
      });
    });

    it('should handle null text fields', (done) => {
      const mockItem: Item = {
        id: '1',
        name: 'New Item',
        text1: null,
        text2: null
      };

      const mockMutate = {
        mutate: of({
          data: { createItem: mockItem }
        })
      };

      apolloSpy.mutate.and.returnValue(mockMutate.mutate as any);

      service.createItem('New Item', null, null).subscribe(result => {
        expect(result).toEqual(mockItem);
        expect(apolloSpy.mutate).toHaveBeenCalledWith({
          mutation: CREATE_ITEM,
          variables: { name: 'New Item', text1: null, text2: null },
          refetchQueries: [{ query: GET_ITEMS }]
        });
        done();
      });
    });
  });

  describe('updateItem', () => {
    it('should update item and return observable', (done) => {
      const mockItem: Item = {
        id: '1',
        name: 'Updated Item',
        text1: 'Updated Text 1',
        text2: 'Updated Text 2'
      };

      const mockMutate = {
        mutate: of({
          data: { updateItem: mockItem }
        })
      };

      apolloSpy.mutate.and.returnValue(mockMutate.mutate as any);

      service.updateItem('1', 'Updated Item', 'Updated Text 1', 'Updated Text 2').subscribe(result => {
        expect(result).toEqual(mockItem);
        expect(apolloSpy.mutate).toHaveBeenCalledWith({
          mutation: UPDATE_ITEM,
          variables: { id: '1', name: 'Updated Item', text1: 'Updated Text 1', text2: 'Updated Text 2' },
          refetchQueries: [{ query: GET_ITEMS }]
        });
        done();
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete item and return observable', (done) => {
      const mockMutate = {
        mutate: of({
          data: { deleteItem: true }
        })
      };

      apolloSpy.mutate.and.returnValue(mockMutate.mutate as any);

      service.deleteItem('1').subscribe(result => {
        expect(result).toBe(true);
        expect(apolloSpy.mutate).toHaveBeenCalledWith({
          mutation: DELETE_ITEM,
          variables: { id: '1' },
          refetchQueries: [{ query: GET_ITEMS }]
        });
        done();
      });
    });
  });

  describe('computed signals', () => {
    it('should compute total count', () => {
      const mockItems: Item[] = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' }
      ];

      const mockWatchQuery = {
        valueChanges: of({
          data: { items: mockItems }
        })
      };

      apolloSpy.watchQuery.and.returnValue(mockWatchQuery as any);

      service.loadItems();

      setTimeout(() => {
        expect(service.totalCount()).toBe(3);
      }, 0);
    });
  });
});
