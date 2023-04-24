import { computed } from "vue";

const useDate = () => {
  const getDate = computed(() => {
    return (dateString: string, mobile: boolean) => {
      const date = new Date(dateString);
      return (
        (mobile ? "" : date.getFullYear() + "/") +
        (date.getMonth() < 9 ? "0" : "") +
        (date.getMonth() + 1) +
        "/" +
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        " " +
        (date.getHours() < 10 ? "0" : "") +
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes() +
        (mobile
          ? ""
          : ":" + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds())
      );
    };
  });

  return { getDate };
};

export default useDate;
