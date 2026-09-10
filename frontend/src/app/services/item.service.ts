import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Item } from '../models/item.model';
import {
  GET_ITEMS,
  CREATE_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
} from '../graphql/item.graphql';

@Injectable({ providedIn: 'root' })
export class ItemService {
  constructor(private apollo: Apollo) {}

  getItems(): Observable<Item[]> {
    // @ts-ignore
      return this.apollo
      .watchQuery<{ items: Item[] }>({ query: GET_ITEMS })
      .valueChanges.pipe(map(result =>

          result.data!.items

         ));
  }

  createItem(name: string, text1: string | null, text2: string | null): Observable<Item> {
    return this.apollo
      .mutate<{ createItem: Item }>({
        mutation: CREATE_ITEM,
        variables: { name, text1, text2 },
        refetchQueries: [{ query: GET_ITEMS }],
      })
      .pipe(map(result => result.data!.createItem));
  }

  updateItem(id: string, name: string, text1: string | null, text2: string | null): Observable<Item> {
    return this.apollo
      .mutate<{ updateItem: Item }>({
        mutation: UPDATE_ITEM,
        variables: { id, name, text1, text2 },
        refetchQueries: [{ query: GET_ITEMS }],
      })
      .pipe(map(result => result.data!.updateItem));
  }

  deleteItem(id: string): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteItem: boolean }>({
        mutation: DELETE_ITEM,
        variables: { id },
        refetchQueries: [{ query: GET_ITEMS }],
      })
      .pipe(map(result => result.data!.deleteItem));
  }
}
