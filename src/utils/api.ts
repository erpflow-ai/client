export type ApiResponse = {
    nodes: Array<{
        id: string;
        type: string;
        position: { x: number; y: number };
        data: {
            label: string;
            details: {
                duration: string;
                cost: string;
                resources: string;
                status: string;
            };
        };
    }>;
    edges: Array<{
        id: string;
        source: string;
        target: string;
    }>;
};

export const mockApiCall = async (orderText: string): Promise<ApiResponse> => {
    console.log("order:", orderText);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 250, y: 100 },
                data: {
                    label: "Project Initiation",
                    details: {
                        duration: "2 weeks",
                        cost: "$50,000",
                        resources: "Project Manager, Architects",
                        status: "In Progress",
                    },
                },
            },
            {
                id: "2",
                type: "custom",
                position: { x: 250, y: 200 },
                data: {
                    label: "Design Phase",
                    details: {
                        duration: "6 weeks",
                        cost: "$150,000",
                        resources: "Design Team, Engineers",
                        status: "Pending",
                    },
                },
            },
            {
                id: "3",
                type: "custom",
                position: { x: 100, y: 300 },
                data: {
                    label: "Material Procurement",
                    details: {
                        duration: "4 weeks",
                        cost: "$300,000",
                        resources: "Procurement Team",
                        status: "Pending",
                    },
                },
            },
            {
                id: "4",
                type: "custom",
                position: { x: 400, y: 300 },
                data: {
                    label: "Construction Phase",
                    details: {
                        duration: "12 weeks",
                        cost: "$800,000",
                        resources: "Construction Team",
                        status: "Pending",
                    },
                },
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
            // { id: "e2-4", source: "2", target: "4" },
        ],
    };
};
