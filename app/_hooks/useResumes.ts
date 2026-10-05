import { ResumesIndexResponse } from "../api/resumes/route";
import useFetch from "./useFetch";

export default function useResumes() {
  return useFetch<ResumesIndexResponse>("/api/resumes");
}
