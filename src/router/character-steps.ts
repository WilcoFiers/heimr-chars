import CharacterSteps from "@/views/CharacterSteps.vue";
import OriginsStep from "@/views/steps/Origins.vue";
import DomainStep from "@/views/steps/Domains.vue";
import PointsStep from "@/views/steps/Points.vue";
import CoppersStep from "@/views/steps/Coppers.vue";
import FinishStep from "@/views/steps/Finish.vue";
import CharacterList from "@/views/CharacterList.vue";
import AuthGuard from "./AuthGuard";

export const characterStepRoutes = [
  {
    path: "/characters",
    name: "character-list",
    component: CharacterList,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId/",
    component: CharacterSteps,
    beforeEnter: AuthGuard,
    children: [
      {
        path: "",
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
