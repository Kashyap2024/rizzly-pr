export interface SessionResult {
    id: string; // Local ID
    serverId: string; // Server's history_id
    text: string;
    type: 'Pickup Line' | 'Reply Generator';
}

let pickupLineSessionResults: SessionResult[] = [];
let replyGeneratorSessionResults: SessionResult[] = [];

export const sessionService = {
    addResult(result: SessionResult) {
        if (result.type === 'Pickup Line') {
            pickupLineSessionResults = [result, ...pickupLineSessionResults];
        } else {
            replyGeneratorSessionResults = [result, ...replyGeneratorSessionResults];
        }
    },

    getResults(type: 'Pickup Line' | 'Reply Generator'): SessionResult[] {
        return type === 'Pickup Line' ? pickupLineSessionResults : replyGeneratorSessionResults;
    },

    clear() {
        pickupLineSessionResults = [];
        replyGeneratorSessionResults = [];
    }
};
