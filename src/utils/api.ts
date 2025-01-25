import { backend_url } from "../config/config";
import axios from "axios";

export type ApiResponse = {
    nodes: Array<{
        id: string;
        type: string;
        position: { x: number; y: number };
        data: {
            label: string;
            details: {
                id: string;
                duration: string;
                cost: string;
                resources: string;
                status: string;
            };
            setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>;
            setSelectedNode?: React.Dispatch<
                React.SetStateAction<string | null>
            >;
        };
    }>;
    edges: Array<{
        id: string;
        source: string;
        target: string;
    }>;
};

const getParent = (ordertext: string, node_id: number) => {
    return {
        id: node_id.toString(),
        type: "custom",
        position: { x: 250, y: 100 },
        data: {
            label: ordertext,
            details: {
                id: node_id.toString(),
                duration: "2 weeks",
                cost: "$50,000",
                resources: "Project Manager, Architects",
                status: "In Progress",
            },
        },
    };
};

const parser = (json: any, orderText: string) => {
    let nodes = [];
    let edges = [];
    let node_id = 1;

    const parent = getParent(orderText, node_id);
    nodes.push(parent);

    for (let i = 0; i < json.work_orders.length; i++) {
        node_id++;
        let node = {
            id: node_id.toString(),
            type: "custom",
            position: { x: 250 - (json.work_orders.length - i) * 150, y: 500 },
            data: {
                label: json.work_orders[i].task,
                details: {
                    id: node_id.toString(),
                    duration: `${json.work_orders[i].duration_days} days`,
                    cost: `$${json.work_orders[i].estimated_cost}`,
                    resources: "Project Manager, Architects",
                    status: "In Progress",
                },
            },
        };
        nodes.push(node);
        edges.push({
            id: `e${parent.id}-${node.id}`,
            source: parent.id,
            target: node.id,
        });
    }
    return { nodes, edges };
};

export const apiCall = async (orderText: string) => {
    const response = axios
        .post(`${backend_url}` + "/gen/construct", {
            input: orderText,
        })
        .then((response: any) => {
            let message = response.data.message;
            console.log(message);
            message = message.substring(7, message.length - 4);
            let json = JSON.parse(message);
            let parsedData = parser(json, orderText);
            return parsedData;
        })
        .catch((error: any) => {
            console.error("Error occurred:", error.message || error);
        });
    return response;
};
