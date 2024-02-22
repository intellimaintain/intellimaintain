import { IdAndName } from "@intellimaintain/domain";

export interface SelectedAndList<T extends IdAndName> {
  options: IdAndName[]
  selected: string | undefined
  item: T | undefined //might not be loaded
}
