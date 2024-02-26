import { HasDisplayPlugins, HasWorkspacePlugins } from "@intellimaintain/react_conversation";
import { ChatState } from "../domain/domain";

export interface DI<Mid> extends HasDisplayPlugins, HasWorkspacePlugins<ChatState> {}