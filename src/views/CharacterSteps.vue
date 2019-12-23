<template>
  <div>
    <v-stepper alt-labels :value="current" class="flat">
      <v-stepper-header>
        <template v-for="(step, i) in steps">
          <v-stepper-step
            class="py-4 rounded"
            :key="step.name"
            :step="i + 1"
            :editable="canAccessStep(step)"
            :complete="canAccessStep(step) && step !== currentStep"
            :color="step === currentStep ? 'primary' : 'accent'"
            edit-icon="$complete"
            @click="changeStep(step)"
            >{{ step.label }}</v-stepper-step
          >
          <v-divider :key="i" v-if="i !== steps.length - 1" />
        </template>
      </v-stepper-header>
    </v-stepper>

    <router-view ref="step" />

    <v-container>
      <div class="d-flex mt-5">
        <v-btn v-if="previousStep" @click="changeStep(previousStep)">
          <v-icon left>mdi-arrow-left-bold-outline</v-icon>
          {{ previousStep.label }}
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="nextStep"
          @click="changeStep(nextStep, true)"
          :class="nextStep.isExit ? 'secondary' : 'primary'"
        >
          {{ nextStep.label }}
          <v-icon right v-if="!nextStep.isExit"
            >mdi-arrow-right-bold-outline</v-icon
          >
          <v-icon right v-else>mdi-exit-to-app</v-icon>
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { State } from "@/types";

type Step = {
  label: string;
  routeName: string;
  isExit?: boolean;
};

const exitStep: Step = {
  label: "My characters",
  routeName: "character-list",
  isExit: true
};

const steps: Step[] = [
  {
    label: "Origins",
    routeName: "character-steps/origins"
  },
  {
    label: "Domains",
    routeName: "character-steps/domains"
  },
  {
    label: "Character points",
    routeName: "character-steps/points"
  },
  {
    label: "Coppers",
    routeName: "character-steps/coppers"
  },
  {
    label: "Finish",
    routeName: "character-steps/finish"
  }
];

export default Vue.extend({
  name: "CharacterSteps",
  data(): { steps: Step[]; current: number } {
    // Stepper is 1-index
    const current =
      1 + steps.findIndex(({ routeName }) => routeName === this.$route.name);
    return { current, steps };
  },

  computed: {
    previousStep(): Step | undefined {
      return this.steps[this.current - 2] || exitStep;
    },
    currentStep(): Step | undefined {
      return this.steps[this.current - 1] || exitStep;
    },
    nextStep(): Step | undefined {
      return this.steps[this.current] || exitStep;
    }
  },

  methods: {
    async changeStep(step: Step, save: boolean = false) {
      const index = steps.findIndex(
        ({ routeName }) => routeName === step.routeName
      );
      const router = this.$refs.step as { save?: () => {} };
      if (save && router.save) {
        const saveResult = await router.save();
        if (saveResult === false) {
          return;
        }
      }

      if (!this.canAccessStep(step)) {
        throw new Error(`Navigation to ${step.routeName} not permitted`);
        return;
      }
      this.current = 1 + (index || 0);
      this.$router.push({ name: step.routeName });
    },

    canAccessStep(step: Step | undefined): boolean {
      const statusSteps = this.$store.getters.stepStates as {
        [propName: string]: "valid" | "invalid";
      };

      if (!step) {
        return false;
      }
      const index = this.steps.findIndex(
        ({ routeName }) => routeName === step.routeName
      );
      // If any of the steps before the one passed in is not valid, return false
      for (let i = 0; i < index; i++) {
        const stepName = this.steps[i].routeName.split("/")[1];
        if (statusSteps[stepName] !== "valid") {
          return false;
        }
      }
      return true;
    }
  }
});
</script>

<style scoped>
.rounded {
  border-radius: 3px;
}
.flat {
  box-shadow: none !important;
  background: transparent !important;
}
</style>
