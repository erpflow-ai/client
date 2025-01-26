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
                subworkers: any[];
                id: string;
                duration: string;
                cost: string;
                bom: string;
                stakeholders: string;
                status: string;
                bom_full: { item: string; price: number; vendor: string }[];
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
                bom: "Bill of Materials",
                stakeholders: "Stakeholders",
                status: "In Progress",
                bom_full: {},
            },
        },
    };
};

const parser = (json: any, orderText: string) => {
    let nodes: any[] = [];
    let edges: any[] = [];
    let total_cost = 0;
    let total_duration = 0;

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
    ) as string[];

    let level = 2;

    const processWorkOrder = (
        work_order_id: any,
        from_node_id: any,
        sequence: number,
        level: number
    ) => {
        const work_order = work_orders_map[work_order_id];
        if (!work_order) return;
        total_cost += work_order.estimated_cost;
        const node = {
            id: work_order.id.toString(),
            type: "custom",
            position: { x: sequence * 500, y: level * 150 },
            data: {
                label: work_order.task,
                details: {
                    id: work_order.id.toString(),
                    duration: `${work_order.duration_days} days`,
                    cost: `$${work_order.estimated_cost}`,
                    bom: work_order.bill_of_materials
                        .map((element: any) => element.item)
                        .join(", "),
                    stakeholders: Object.keys(work_order.stakeholders).join(
                        ", "
                    ),
                    status: "In Progress",
                    bom_full: work_order.bill_of_materials,
                },
            },
        };
        nodes.push(node);
        let found: boolean = false;
        if (edges.find((edge) => edge.id === `e${from_node_id}-${node.id}`)) {
            found = true;
        }
        if (!found) {
            edges.push({
                id: `e${from_node_id}-${node.id}`,
                source: from_node_id,
                target: node.id,
            });
        }

        let sequence_num = 0;
        const len = work_order.child_work_orders.length;
        let max_duration = 0;
        for (const child_id of work_order.child_work_orders) {
            const child = work_orders_map[child_id];
            if (child.duration_days > max_duration) {
                max_duration = child.duration_days;
            }

            processWorkOrder(
                child_id,
                node.id,
                sequence_num - (len - 1) / 2,
                level + 1
            );
            sequence_num++;
        }
        console.log(level, ">>>>>", max_duration);
        total_duration += max_duration;
    };

    let sequence = 0;
    const len = root_work_order_ids.length;
    let max_duration = 0;
    for (const root_id of root_work_order_ids) {
        const root = work_orders_map[root_id];

        if (root.duration_days > max_duration) {
            max_duration = root.duration_days;
        }

        processWorkOrder(root_id, parent.id, sequence - (len - 1) / 2, level);
        sequence++;
    }
    console.log(level, ">>>>>", max_duration);

    total_duration += max_duration;

    parent.data.details.duration = `${total_duration} days`;
    parent.data.details.cost = `$${total_cost}`;

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
            console.log(json);
            let parsedData = parser(json, orderText);
            return parsedData;
        })
        .catch((error: any) => {
            console.error("Error occurred:", error.message || error);
        });
    return response;
};
