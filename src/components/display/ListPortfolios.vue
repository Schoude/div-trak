<script setup lang='ts'>
import ButtonAction from '@/components/buttons/ButtonAction.vue';
import IconAdd from '@/components/icons/IconAdd.vue';
import InputText from '@/components/inputs/InputText.vue';
import LabelFormInput from '@/components/inputs/LabelFormInput.vue';
import ModalBase from '@/components/modals/ModalBase.vue';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/supabase/client';
import type { Tables } from '@/supabase/types/database';
import type { DbResult } from '@/supabase/types/helpers';
import { computed, ref } from 'vue';

type NewPortfolio = Omit<Tables<'portfolios'>, 'id' | 'created_at' | 'updated_at'>;

const authStore = useAuthStore();

const root = ref<typeof ModalBase | null>(null);
const modalIsOpen = ref(false);
const nameNewPortfolio = ref('');
const isLoading = ref(false);
const canSend = computed(() => !isLoading.value || nameNewPortfolio.value !== '');

function onModalClose () {
  root.value?.$el.close();
  modalIsOpen.value = false;
  nameNewPortfolio.value = '';
}

function onOpenModalOpen () {
  root.value?.$el.showModal();
  modalIsOpen.value = true;
}

async function onSaveNewPortfolio () {
  if (!canSend.value) {
    return;
  }

  try {
    isLoading.value = true;

    const portfolio: NewPortfolio = {
      name: nameNewPortfolio.value,
      user_id: authStore.user?.id!,
      isins: [],
    };

    const addPortfolioQuery = supabase.from('portfolios').insert(portfolio).select().single();

    const addPortfolioResult: DbResult<typeof addPortfolioQuery> =
      await addPortfolioQuery;

    if (addPortfolioResult.error) {
      console.error(addPortfolioResult.error);
    }

    const addedPortfolio = addPortfolioResult.data;

    if (addedPortfolio) {
      await authStore.checkSession(authStore.sessionToken!);
    }

  } catch (error) {
    console.error(error);
  } finally {
    onModalClose();
    isLoading.value = true;
  }
}
</script>

<template>
  <h1 class="title-portfolios">Your Portfolios</h1>
  <ButtonAction variant="dawn" class="button-new-portfolio" @click="onOpenModalOpen">
    <div class="content">
      <IconAdd />
      <span>New Portfolio</span>
    </div>
  </ButtonAction>

  <ModalBase class="modal-add-portfolio" ref="root" @close="onModalClose">
    <template #title>Add new Portfolio</template>
    <template #content>
      <div v-if="modalIsOpen" class="inner">
        <LabelFormInput for-input="phone" text="Portfolio Name">
          <InputText v-model="nameNewPortfolio" id="name-new-portfolio" placeholder="My new Portfolio" />
        </LabelFormInput>

        <ButtonAction type="button" variant="dawn" class="button-save-portfolio" @click="onSaveNewPortfolio">
          <span>Save Portfolio</span>
        </ButtonAction>
      </div>
    </template>
  </ModalBase>

  <ul class="list">
    <li v-for="portfolio of authStore.user?.portfolios" :key="portfolio.name">
      <RouterLink :to="{ name: 'portfolio', params: { id: portfolio.id } }" class="portfolio">
        <div class="name text-l">{{ portfolio.name }}</div>
        <div class="count-instruments">Instruments: {{ portfolio.isins.length }}</div>
      </RouterLink>
    </li>
  </ul>
</template>

<style lang='scss' scoped>
@use '../../styles/mixins';

.title-portfolios {
  margin-block-end: 1rem;
}

.button-new-portfolio {
  margin-block-end: 1rem;
  block-size: 2.25rem;
  inline-size: fit-content;

  .content {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding-inline: 1rem 1.3rem;
  }

  .icon-add {
    fill: currentColor;
  }
}

.list {
  padding: 0;
  padding-block-start: 1rem;
  display: grid;
  gap: 1rem;
  list-style: none;
  
  @media only screen and (width >=768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media only screen and (width >=1280px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.portfolio {
  display: block;
  padding: .35rem .6rem;
  border-radius: 8px;
  text-decoration: none;
  outline: none;
  @include mixins.bg-list-item;

  &:visited {
    color: currentColor;
  }
}

.modal-add-portfolio {
  max-inline-size: 500px;
  overflow: hidden;
}

.inner {
  padding-inline: .5rem;
  padding-block-end: .5rem;
}
</style>
