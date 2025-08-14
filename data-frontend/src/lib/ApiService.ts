import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  CancelTokenSource,
  AxiosRequestHeaders,
} from "axios";
import { toast } from "sonner";

interface ApiError {
  message: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface ApiServicesResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: Error;
}

interface StoreHandlers<T> {
  setStore?: (item: T) => void;
  updateStore?: (item: T) => void;
  deleteStore?: (id: string) => void;
  addStore?: (item: T) => void;
}

class ApiService {
  private cancelTokenSource?: CancelTokenSource;
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = "/api/") {
    this.axiosInstance = axios.create({ baseURL: baseUrl });
  }

  private showToast<T>(response: ApiServicesResponse<T>, action: string) {
    const description = response.success
      ? response.message || `${action} operation completed successfully.`
      : response.error?.message || "Something went wrong";

    toast(response.success ? "Success" : "Error", { description });
  }

  private getHeaders(isMultipart: boolean): AxiosRequestHeaders {
    const headers = {
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    } as AxiosRequestHeaders;
    return headers;
  }

  async get<T>(
    endpoint: string,
    showToast = true,
    options: {
      setStore?: (item: T) => void;
      hydrated?: boolean;
      setHydrated?: () => void;
    } = {}
  ): Promise<ApiServicesResponse<T>> {
    const { setStore, hydrated, setHydrated } = options;
    const action = "GET";

    if (hydrated) {
      return { success: true, message: "Store already hydrated" };
    }

    // Cancel previous request if exists
    this.cancelTokenSource?.cancel("Request canceled due to a new request.");
    this.cancelTokenSource = axios.CancelToken.source();

    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.get(endpoint, {
          cancelToken: this.cancelTokenSource.token,
        });

      setHydrated?.();
      setStore?.(response.data.data);

      const result: ApiServicesResponse<T> = {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };

      if (showToast) this.showToast(result, action);
      return result;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("Previous request canceled:", (error as Error).message);
        return { success: false, error: new Error("Request canceled") };
      }

      const axiosError = error as AxiosError<ApiError>;
      const result: ApiServicesResponse<T> = {
        success: false,
        error: new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "An unknown error occurred"
        ),
      };

      if (showToast) this.showToast(result, action);
      return result;
    } finally {
      this.cancelTokenSource = undefined;
    }
  }

  async post<T>(
    endpoint: string,
    data: T,
    isMultipart = false,
    showToast = true,
    { addStore }: StoreHandlers<T> = {}
  ): Promise<ApiServicesResponse<T>> {
    const action = "POST";
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.post(endpoint, data, {
          headers: this.getHeaders(isMultipart),
        });

      addStore?.(response.data.data);

      const result: ApiServicesResponse<T> = {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };

      if (showToast) this.showToast(result, action);
      return result;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const result: ApiServicesResponse<T> = {
        success: false,
        error: new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "An unknown error occurred"
        ),
      };

      if (showToast) this.showToast(result, action);
      return result;
    }
  }

  async put<T>(
    endpoint: string,
    data: T,
    isMultipart = false,
    showToast = true,
    { updateStore }: StoreHandlers<T> = {}
  ): Promise<ApiServicesResponse<T>> {
    const action = "UPDATE";
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.put(endpoint, data, {
          headers: this.getHeaders(isMultipart),
        });

      updateStore?.(response.data.data);

      const result: ApiServicesResponse<T> = {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };

      if (showToast) this.showToast(result, action);
      return result;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const result: ApiServicesResponse<T> = {
        success: false,
        error: new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "An unknown error occurred"
        ),
      };

      if (showToast) this.showToast(result, action);
      return result;
    }
  }

  async delete<T>(
    endpoint: string,
    showToast = true,
    { deleteStore }: StoreHandlers<T> = {}
  ): Promise<ApiServicesResponse<T>> {
    const action = "DELETE";
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.delete(endpoint);

      const deletedId = (response.data.data as unknown as { _id?: string })
        ?._id;
      if (deletedId) deleteStore?.(deletedId);

      const result: ApiServicesResponse<T> = {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };

      if (showToast) this.showToast(result, action);
      return result;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const result: ApiServicesResponse<T> = {
        success: false,
        error: new Error(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "An unknown error occurred"
        ),
      };

      if (showToast) this.showToast(result, action);
      return result;
    }
  }
}

export default ApiService;
