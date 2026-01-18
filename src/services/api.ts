const BASE_URL_NO_API = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const BASE_URL = `${BASE_URL_NO_API}/api`;

export interface GenerateRizzParams {
    type?: 'text' | 'ocr';
    prompt?: string;
    imagePath?: string;
}

export interface GenerateRizzResponse {
    rizz: string;
    history_id: string;
    model: string;
    is_last_free_rizz: boolean;
}

export interface FeedbackResponse {
    success: boolean;
    message: string;
}

class ApiService {
    private async request<T>(endpoint: string, method: string, body: any, token: string): Promise<T> {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`[API] ${method} ${url}`, body);

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        const text = await response.text();
        console.log(`[API] Response ${response.status}:`, text.substring(0, 500) + (text.length > 500 ? '...' : ''));

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(text);
            } catch (e) {
                errorData = { message: `Request failed with status ${response.status}. Response was not JSON.` };
            }
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('[API] JSON Parse Error. Raw response was:', text);
            throw e;
        }
    }

    async generateRizz(params: GenerateRizzParams, token: string): Promise<GenerateRizzResponse> {
        return this.request<GenerateRizzResponse>('/generate-rizz', 'POST', params, token);
    }

    async provideFeedback(history_id: string, feedback: 'like' | 'dislike', token: string): Promise<FeedbackResponse> {
        return this.request<FeedbackResponse>('/feedback', 'POST', { history_id, feedback }, token);
    }
}

export const apiService = new ApiService();
