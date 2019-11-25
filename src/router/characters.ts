import CharacterList from "@/views/character/CharacterList.vue";
import CharacterNew from "@/views/character/CharacterNew.vue";
import CharacterUpdate from "@/views/character/CharacterUpdate.vue";
import CharacterResources from "@/views/character/CharacterResources.vue";
import CharacterDomains from "@/views/character/CharacterDomains.vue";
import DomainContent from "@/views/DomainContent.vue";
import AuthGuard from "./AuthGuard";

export const characterRoutes = [
  {
    path: "/characters",
    name: "character-list",
    component: CharacterList,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/new",
    name: "character-new",
    component: CharacterNew,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId",
    name: "character-update",
    component: CharacterUpdate,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId/domains",
    name: "character-domains",
    component: CharacterDomains,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId/domains/:domain",
    name: "domain-content",
    component: DomainContent,
    beforeEnter: AuthGuard
  },
  {
    path: "/characters/:charId/resources",
    name: "character-resources",
    component: CharacterResources,
    beforeEnter: AuthGuard
  }
];
