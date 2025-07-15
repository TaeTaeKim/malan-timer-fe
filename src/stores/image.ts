import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useImageStore = defineStore("image", () => {
  const loading = ref(false);

  async function uploadToMinio(file: File, inferenceSuccess: boolean) {
    const minioForm = new FormData();
    minioForm.append("image", file);
    minioForm.append("inferenceSuccess", inferenceSuccess ? "true" : "false");

    axios
      .post("timer/image", minioForm, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 5000,
      })
      .catch(() => {
        /* 무시 */
      });
  }

  async function processImage(
    file: File,
    onExtracted: (data: { level: number; exp: number; meso: number }) => void
  ) {
    loading.value = true;
    let inferenceSuccess = false;
    let extracted: { level: number; exp: number; meso: number } | null = null;
    try {
      // AI 추출
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000,
      });
      const { extracted_data } = response.data;
      const hasAnyField =
        extracted_data &&
        (extracted_data.level != null ||
          extracted_data.exp != null ||
          extracted_data.meso != null);

      if (hasAnyField) {
        inferenceSuccess = true;
        extracted = {
          level: Number(extracted_data.level),
          exp: Number(extracted_data.exp),
          meso: Number(extracted_data.meso),
        };
      } else {
        throw new Error("No valid extracted_data in response");
      }
    } catch (e) {
      alert("AI 추출에 실패했습니다.");
    } finally {
      // Always save image, regardless of error
      uploadToMinio(file, inferenceSuccess);
      if (inferenceSuccess && extracted) {
        onExtracted(extracted);
      }
      loading.value = false;
    }
  }

  return { loading, processImage };
});
