<template>
    <Page>
        <!-- <div class="w-1/2 m-auto text-center pt-6">
            <h1 class="text-2xl mb-8 font-bold text-gray-600">{{ trans('global.pages.welcome') }}</h1>
        </div> -->
        <iframe class="w-full min-h-[90vh] mt-8" src="https://ranking.lineaitalia.net/ranking.php" title="Ranking vendedores"></iframe>
    </Page>
</template>

<script>
import {defineComponent} from 'vue';
import {trans} from "@/helpers/i18n";
import Page from "@/views/layouts/Page";

export default defineComponent({
    components: {
        Page
    },
    setup() {
        return {
            trans
        }
    }
});
</script>
