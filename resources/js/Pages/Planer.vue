<template>
  <nav class="flex justify-between items-end p-4 border-b border-gray-300">
    <Link :href="`/planers/${slug}`"
      ><h1 class="text-3xl">
        Studienplanungsinstrument
        <span v-if="name">{{ name }}</span>
      </h1></Link
    >
  </nav>
  <div class="p-4 max-w-6xl mx-auto">
    <h2 class="text-2xl mt-4 mb-4">
      Willkommen zum Studienplanungsinstrument (Stupli) {{ name }}
    </h2>

    <p>
      Hier können Sie Ihren provisorischen Wunsch-Studienverlauf über alle
      Semester planen. Der zusammengestellte Plan dient als Orientierung! Die
      Realität sieht künftig allfällig anders aus. Die HfH behält sich vor,
      Module bei zu geringer Nachfrage abzusagen.
    </p>

    <h3 class="text-xl mt-3">Wichtig</h3>
    <p>
      Dieses Instrument hat nichts mit der offiziellen Modul-Einschreibung für
      das HfH Studium im daylight-Web zu tun.
    </p>
    <div class="my-8 py-8 w-full flex justify-evenly">
      <div>
        <h2 class="text-xl">Ich habe bereits einen Plan.</h2>
        <div>
          <form @submit.prevent="viewPlan" class="mt-4 w-64">
            <label for="slug" class="text-sm uppercase">Plan-Nummer</label>
            <input
              type="text"
              name="slug"
              id="slug"
              class="
                leading-4
                w-full
                block
                border border-gray-600
                rounded
                shadow-inner
                p-2
              "
              placeholder="X63p4Z"
              v-model="planSlug"
              required
            />
            <Button class="w-full mt-3">Anschauen</Button>
          </form>
        </div>
      </div>
      <div>
        <h2 class="text-xl">Ich möchte einen neuen Plan erstellen.</h2>
        <div>
          <form @submit.prevent="createPlan" class="mt-4 w-64">
            <label for="year" class="text-sm uppercase">Jahr</label>
            <select
              v-model="createForm.startYear"
              required
              class="
                block
                border border-gray-600
                rounded
                shadow-inner
                p-2
                w-full
              "
            >
              <option value="" disabled>Bitte wählen...</option>
              <option :value="2022">2022</option>
            </select>
            <div v-if="createForm.errors.startYear">
              {{ createForm.errors.startYear }}
            </div>
            <Button class="w-full mt-3">Plan erstellen</Button>
          </form>
        </div>
      </div>
    </div>
    <div>
      <p>
        <HfHLink :href="degreeLink">Alle Infos zum {{ name }}</HfHLink>
      </p>

      <p class="mt-2">
        <HfHLink :href="moduleDirectoryLink">Zum Modulverzeichnis</HfHLink>
      </p>
      <p class="mt-4">{{ date }}, Änderungen vorbehalten.</p>
    </div>
  </div>
</template>

<script>
import Button from "../Components/Button.vue";
import HfHLink from "../Components/HfHLink.vue";
export default {
  components: {
    Button,
    HfHLink,
  },
  props: {
    slug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    degreeLink: {
      type: String,
      required: true,
      default:
        "https://www.hfh.ch/ausbildung/ma-heilpaedagogische-frueherziehung/auf-einen-blick", //todo get from server
    },
    moduleDirectoryLink: {
      type: String,
      required: true,
      default:
        "https://daylightweb.hfh.ch/modulverzeichnis-1/ma-heilpaedagogische-frueherziehung-hfe", //todo get from server
    },
  },
  data() {
    return {
      createForm: this.$inertia.form({
        startYear: "",
      }),
      planSlug: "",
    };
  },
  computed: {
    date() {
      return new Date().toLocaleDateString();
    },
  },
  methods: {
    createPlan() {
      this.createForm.post(`/planers/${this.slug}/plans`, {
        onSuccess: () => this.createForm.reset(),
      });
    },
    viewPlan() {
      this.$inertia.get(`/planers/${this.slug}/plans/${this.planSlug}`);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>