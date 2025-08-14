interface ChatMessages {
    id: string,
    user?: boolean,
    content: string,
} 

interface ApiServicesResponse<T> {
	success: boolean;
	data?: T; // Optional, as it might be undefined in case of an error
	error?: Error | null; // Optional, with a null fallback
	message?: string;
}
 interface ColumnDetails{
    name: string;
    type: string;
    nulls: number;
    unique: number;
}