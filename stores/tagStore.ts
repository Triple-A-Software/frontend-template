import { defineStore } from "pinia";

const useTagStore = defineStore("tag", () => {
    const TagService = useTagService();

    const tagsData = useAsyncData("tagStore:tags", async () => {
        const data = await TagService.getAll();
        return data?.tags ?? [];
    });

    function fetchTags() {
        tagsData.refresh();
    }

    const tags = computed(() => tagsData.data.value ?? []);

    return {
        tags,
        fetchTags,
    };
});

export default useTagStore;
