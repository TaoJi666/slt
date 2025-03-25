import {Form, Modal, Input, Col, Row} from "antd"
import "./TableModal.css"
const TableModal = (props) => {
    // eslint-disable-next-line react/prop-types
    const {rowRecord, isModalOpen, setIsModalOpen} = props
    const [form] = Form.useForm();

    // const [initialFormData, setInitialFormData] = useState({
    //     connectionMethod: rowRecord.connectionMethod,
    //     coolingMethod: rowRecord.coolingMethod,
    //     fanType: rowRecord.fanType,
    //     flow: rowRecord.flow,
    //     hostBrand: rowRecord.hostBrand,
    //     hostLevel: rowRecord.hostLevel,
    //     modelCnName: rowRecord.modelCnName,
    //     modelEnName: rowRecord.modelEnName,
    //     modelId: rowRecord.modelId,
    //     power: rowRecord.power,
    //     pressure: rowRecord.pressure,
    //     productId: rowRecord.productId,
    //     protectionLevel: rowRecord.protectionLevel,
    //     voltageFrequency: rowRecord.voltageFrequency,
    //     voltagePhase: rowRecord.voltagePhase,
    // })

    const handleOk = () => {
        setIsModalOpen(false)
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <Modal
            title="修改"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            width={"50%"}
            style={{position: "absolute", top: "10vh", marginLeft: "calc(100vw - 75%)"}}
        >
            <Form form={form}
                  initialValues={rowRecord}
                  labelCol={{span: 9}}>
                <Row justify="space-evenly">
                    <Col span={11}>
                        <Form.Item label={"connectionMethod"} name={"connectionMethod"}>
                            <Input placeholder={rowRecord.connectionMethod}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item label={"coolingMethod"} name={"coolingMethod"}>
                            <Input placeholder={rowRecord.coolingMethod}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-evenly">
                    <Col span={11}>
                        <Form.Item label={"fanType"} name={"fanType"}>
                            <Input placeholder={rowRecord.fanType}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item label={"flow"} name={"flow"}>
                            <Input placeholder={rowRecord.flow}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-evenly">
                    <Col span={11}>
                        <Form.Item label={"hostBrand"} name={"hostBrand"}>
                            <Input placeholder={rowRecord.hostBrand}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item label={"hostLevel"} name={"hostLevel"}>
                            <Input placeholder={rowRecord.hostLevel}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-evenly">
                    <Col span={11}>
                        <Form.Item label={"modelCnName"} name={"modelCnName"}>
                            <Input placeholder={rowRecord.modelCnName}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item label={"modelEnName"} name={"modelEnName"}>
                            <Input placeholder={rowRecord.modelEnName}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-evenly">
                    <Col span={11}>
                        <Form.Item label={"modelId"} name={"modelId"}>
                            <Input placeholder={rowRecord.modelId}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item label={"power"} name={"power"}>
                            <Input placeholder={rowRecord.power}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-evenly">
                    <Col span={11}>
                        <Form.Item label={"pressure"} name={"pressure"}>
                            <Input placeholder={rowRecord.pressure}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item label={"productId"} name={"productId"}>
                            <Input placeholder={rowRecord.productId}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-evenly">
                    <Col span={11}>
                        <Form.Item label={"protectionLevel"} name={"protectionLevel"}>
                            <Input placeholder={rowRecord.protectionLevel}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        <Form.Item label={"voltageFrequency"} name={"voltageFrequency"}>
                            <Input placeholder={rowRecord.voltageFrequency}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="space-evenly">
                    <Col span={11}>
                        <Form.Item label={"voltagePhase"} name={"voltagePhase"}>
                            <Input placeholder={rowRecord.voltagePhase}/>
                        </Form.Item>
                    </Col>
                    <Col span={11}>
                        {/*<Form.Item label={"voltageFrequency"} name={"voltageFrequency"}>*/}
                        {/*    <Input placeholder={rowRecord.voltageFrequency}/>*/}
                        {/*</Form.Item>*/}
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
export default TableModal