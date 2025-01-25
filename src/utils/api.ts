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

const getParent = (ordertext: string, node_id: string) => {
    return {
        id: node_id,
        type: "custom",
        position: { x: 0, y: 100 },
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
    let nodes: any[] = [];
    let edges: any[] = [];

    let node_id = "parent";
    const parent = getParent(orderText, node_id);
    nodes.push(parent);

    const work_orders_map: { [key: string]: any } = {};
    for (const wo of json.work_orders) {
        work_orders_map[wo.id] = wo;
    }

    const all_work_order_ids = new Set();
    const child_work_order_ids = new Set();

    for (const wo of json.work_orders) {
        all_work_order_ids.add(wo.id);
        for (const child_id of wo.child_work_orders) {
            child_work_order_ids.add(child_id);
        }
    }

    const root_work_order_ids = [...all_work_order_ids].filter(
        (id) => !child_work_order_ids.has(id)
    );

    let level = 2;

    const processWorkOrder = (
        work_order_id: any,
        from_node_id: any,
        sequence: number,
        level: number
    ) => {
        const work_order = work_orders_map[work_order_id];
        if (!work_order) return;
        const node = {
            id: work_order.id.toString(),
            type: "custom",
            position: { x: sequence * 500, y: level * 150 },
            data: {
                label: work_order.task,
                details: {
                    id: work_order.id.toString(),
                    duration: `${sequence} days`,
                    cost: `$${level}`,
                    resources: Object.keys(work_order.stakeholders).join(", "),
                    status: "In Progress",
                },
            },
        };
        nodes.push(node);
        edges.push({
            id: `e${from_node_id}-${node.id}`,
            source: from_node_id,
            target: node.id,
        });
        let sequence_num = 0;
        const len = work_order.child_work_orders.length;
        for (const child_id of work_order.child_work_orders) {
            processWorkOrder(
                child_id,
                node.id,
                sequence_num - (len - 1) / 2,
                level + 1
            );
            sequence_num++;
        }
    };

    let sequence = 0;
    const len = root_work_order_ids.length;
    for (const root_id of root_work_order_ids) {
        processWorkOrder(root_id, parent.id, sequence - (len - 1) / 2, level);
        sequence++;
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
            // console.log(">>>>>>", json);
            let parsedData = parser(json, orderText);
            return parsedData;
        })
        .catch((error: any) => {
            console.error("Error occurred:", error.message || error);
        });
    return response;
};
