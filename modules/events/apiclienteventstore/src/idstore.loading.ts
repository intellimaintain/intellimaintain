import { IdStore } from "@intellimaintain/idstore";

export interface ApiIdStore {
  url: string;
}
export function idStoreFromApi ( apiIdStore: ApiIdStore ): IdStore {
  return async id => {
    let response = await fetch ( apiIdStore.url + "?id=" + id );
    const result = await response.text ();
    return response.status < 400 ?
      { id, result: result } :
      { id, error: `Error loading ${apiIdStore.url} ${response.status}\n${result}` };
  }

}