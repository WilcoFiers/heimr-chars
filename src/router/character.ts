import CharacterCreation from "@/views/character/CharacterCreation.vue";
import OriginsStep from "@/views/character/creation/Origins.vue";
import DomainStep from "@/views/character/creation/Domains.vue";
import PointsStep from "@/views/character/creation/Points.vue";
import CoppersStep from "@/views/character/creation/Coppers.vue";
import FinishStep from "@/views/character/creation/Finish.vue";
import CharacterList from "@/views/character/CharacterList.vue";
import CharacterOverview from "@/views/character/CharacterOverview.vue";
import AuthGuard from "./AuthGuard";

export const characterRoutes = [
  {
    path: "/characters",
    name: "character-list",
    component: CharacterList,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId",
    name: "character-overview",
    component: CharacterOverview
  },
  {
    path: "/characters/:charId/create/",
    component: CharacterCreation,
    beforeEnter: AuthGuard,
    children: [
      {
        path: "origin",
        name: "character-steps/origins",
        component: OriginsStep
      },
      {
        path: "domains",
        name: "character-steps/domains",
        component: DomainStep
      },
      {
        path: "points",
        name: "character-steps/points",
        component: PointsStep
      },
      {
        path: "coppers",
        name: "character-steps/coppers",
        component: CoppersStep
      },
      {
        path: "finish",
        name: "character-steps/finish",
        component: FinishStep
      }
    ]
  }
];
