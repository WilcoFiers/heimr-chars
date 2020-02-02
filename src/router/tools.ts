import AuthGuard from "./AuthGuard";
import GamesTools from "@/views/GamesTools.vue";
import AutomataList from "@/views/tools/AutomataList.vue";
import AutomataEditor from "@/views/tools/AutomataEditor.vue";
import ComplicationDeck from "@/views/tools/ComplicationDeck.vue";

export const toolsRoutes = [
  {
    name: "GamesTools",
    path: "/games",
    component: GamesTools
  },
  {
    name: "ComplicationDeck",
    path: "/games/complications",
    component: ComplicationDeck
  },
  {
    name: "AutomataList",
    path: "/games/automata",
    beforeEnter: AuthGuard,
    component: AutomataList
  },
  {
    name: "AutomataEditor",
    path: "/games/automata/:automataId",
    component: AutomataEditor
  }
];
