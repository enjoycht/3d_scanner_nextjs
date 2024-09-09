'use client';

import React , { useState , useEffect } from 'react' ;
import axios from 'axios' ;
import { Container , Row , Col , Card , Form , Button , InputGroup , ButtonGroup } from 'react-bootstrap' ;
import { useUrl } from '../compoent/UrlContext' ;
import { useInfo } from '../compoent/info' ;
import { useMsg } from '../compoent/websocket' ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const Setting = () => { 

		const { url } = useUrl () ;
		const { info } = useInfo () ;
		const { stopMsg } = useMsg () ;

		const [ zAxisSteps , setZAxisSteps ] = useState ( 1000 ) ;
		const [ moduleData , setModuleData ] = useState ( { 

				z_axis_max: "" , 
				z_axis_one_time_step: "" , 
				z_axis_delay_time: "" , 
				z_axis_start_step: "" , 
				x_y_axis_max: "" , 
				x_y_axis_check_times: "" , 
				x_y_axis_one_time_step: "" , 
				x_y_axis_step_delay_time: "" , 
				vl53l1x_center: "" , 
				vl53l1x_timeing_budget: ""

		} ) ;

		const [ moduleDataP , setModuleDataP ] = useState ( { 

				z_axis_max: "" , 
				z_axis_one_time_step: "" , 
				z_axis_delay_time: "" , 
				z_axis_start_step: "" , 
				x_y_axis_max: "" , 
				x_y_axis_check_times: "" , 
				x_y_axis_one_time_step: "" , 
				x_y_axis_step_delay_time: "" , 
				vl53l1x_center: "" , 
				vl53l1x_timeing_budget: ""


		} ) ;

		useEffect ( () => { 

				setModuleDataP ( info [ 'module' ] ) ;
				setModuleChange ( 'vl53l1x_timeing_budget' , info [ 'module' ] [ 'vl53l1x_timeing_budget' ] ) ;

		} , [ info ] ) ;

		const saveButtonClick = () => { 

				let param = "" ;

				for ( const key in moduleData ) { 

						if ( moduleData [ key as keyof typeof moduleData ] === "" ) { 

								param += `$ { key } = $ { moduleDataP [ key as keyof typeof moduleDataP ] } &` ;

						} else { 

								param += `$ { key } = $ { moduleData [ key as keyof typeof moduleData ] } &` ;

						} 

				} 

				param = param.slice ( 0 , -1 ) ;
				console.log ( `Save Setting: $ { param } ` ) ;

				if ( !url || url == = "" || url == = undefined || url.includes ( "github.io" ) || url.includes ( "github.dev" ) ) { 
					
						return ;
						
				} ;

        axios.get ( `http://${url}/api/set/data?${param}`)

						.then ( response => { 

								if ( response.data ) { 

										console.log ( 'ESP32 Data:' , response.data ) ;

								} 

						} ) 

						.catch ( error => { 

								console.error ( 'Error fetching data:' , error ) ;

						} ) ;

		} 

		const zAxisButtonClick = ( command: string , steps: number = 1 ) => { 

				console.log ( `Z Axis $ { command }: $ { steps } steps` ) ;

				if ( !url || url == = "" || url == = undefined || url.includes ( "github.io" ) || url.includes ( "github.dev" ) ) { 
					
				    return ; 
				    
				} ;

        let myUrl = `http://${url}/api/set/scanner?command=${command}`;

				if ( command !== "home" ) { 

						myUrl += `&step = $ { steps } ` ;

				} 

				axios.get ( myUrl ) 

						.then ( response => { 

								if ( response.data ) { 

										console.log ( 'ESP32 Data:' , response.data ) ;

								} 

						} ) 

						.catch ( error => { 

								console.error ( 'Error fetching data:' , error ) ;

						} ) ;
		} 

		const setModuleChange = ( key: string , value: string ) => { 

				setModuleData ( prevData => { return { ...prevData , [ key ]: value } } ) ;

		} 

    return (

        <main className='d-flex'> 
            <Container className='flex-grow-1 d-flex'>
                <div className='d-flex flex-grow-1'>
                    <div className='d-flex flex-grow-1'>
                        <Card bg="light" className='text-center flex-grow-1 my-5 mx-4'>
                            <Card.Header className='fs-2'>
                                <Row>
                                    <Col></Col>
                                    <Col>模組參數設定</Col>
                                    <Col>
                                        <div className="d-grid gap-2">
                                            <ButtonGroup as={Col} md={12}>
                                                <Button onClick={saveButtonClick} variant='outline-success' size="lg">存檔</Button>
                                                <Button onClick={() => axios.get(`http://${url}/api/restart`)} variant='outline-danger' size="lg">重啟</Button>
                                            </ButtonGroup>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Container>
                                    <Row className='py-2'>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Z軸最大值(最低點至最高點微步總數)</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.z_axis_max}
                                                    defaultValue={moduleData.z_axis_max}
                                                    onChange={(e) => setModuleChange('z_axis_max', e.target.value)}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                            </InputGroup>
                                            <Form.Text  muted>
                                                {"總共上升: "}
                                                {(isNaN(parseInt(moduleData.z_axis_max))? parseFloat(moduleDataP.z_axis_max): parseFloat(moduleData.z_axis_max))}
                                                {"微步 / "}
                                                {(isNaN(parseInt(moduleData.z_axis_one_time_step))? parseFloat(moduleDataP.z_axis_one_time_step): parseFloat(moduleData.z_axis_one_time_step))}
                                                {"微步 = "}
                                                { (isNaN(parseInt(moduleData.z_axis_max))? parseFloat(moduleDataP.z_axis_max): parseFloat(moduleData.z_axis_max)) / 
                                                  (isNaN(parseInt(moduleData.z_axis_one_time_step))? parseFloat(moduleDataP.z_axis_one_time_step): parseFloat(moduleData.z_axis_one_time_step)) }
                                                {"次"}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Z軸每次上升微步(每微步為 0.00125 mm)</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.z_axis_one_time_step}
                                                    defaultValue={moduleData.z_axis_one_time_step}
                                                    onChange={(e) => setModuleChange('z_axis_one_time_step', e.target.value)}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                            </InputGroup>
                                            <Form.Text muted>
                                                {"每次上升高度: "}
                                                {isNaN(parseInt(moduleData.z_axis_one_time_step))? parseInt(moduleDataP.z_axis_one_time_step): parseInt(moduleData.z_axis_one_time_step)}
                                                {"微步 * 0.00125 mm = "}{(isNaN(parseInt(moduleData.z_axis_one_time_step))? parseFloat(moduleDataP.z_axis_one_time_step): parseFloat(moduleData.z_axis_one_time_step)) * 0.00125}
                                                {"mm"}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Z軸速度(時間為2倍)</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.z_axis_delay_time}
                                                    defaultValue={moduleData.z_axis_delay_time}
                                                    onChange={(e) => setModuleChange('z_axis_delay_time', e.target.value)}
                                                />
                                                <InputGroup.Text>delayMicroseconds</InputGroup.Text>
                                            </InputGroup>
                                            <Form.Text muted>
                                                {"上升總時長: "}
                                                { (isNaN(parseInt(moduleData.z_axis_max))? parseFloat(moduleDataP.z_axis_max): parseFloat(moduleData.z_axis_max))}
                                                {"微步 * "}
                                                { (isNaN(parseInt(moduleData.z_axis_delay_time))? parseFloat(moduleDataP.z_axis_delay_time): parseFloat(moduleData.z_axis_delay_time))}
                                                {"µs = "}
                                                { (isNaN(parseInt(moduleData.z_axis_max))? parseFloat(moduleDataP.z_axis_max): parseFloat(moduleData.z_axis_max)) *
                                                  (isNaN(parseInt(moduleData.z_axis_delay_time))? parseFloat(moduleDataP.z_axis_delay_time): parseFloat(moduleData.z_axis_delay_time)) / 500000 }
                                                {"秒"}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Z軸初始矯正值(無須調整)</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    disabled
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.z_axis_start_step}
                                                    defaultValue={moduleData.z_axis_start_step}
                                                    onChange={(e) => setModuleChange('z_axis_start_step', e.target.value)}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2'> 
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>X Y軸 1 圈微步(1/32 步進馬達 1 圈為 6400 微步)</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        disabled
                                                        required
                                                        type="text"
                                                        placeholder={moduleDataP.x_y_axis_max}
                                                        defaultValue={moduleData.x_y_axis_max}
                                                        onChange={(e) => setModuleChange('x_y_axis_max', e.target.value)}
                                                    />
                                                    <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                                <Form.Text muted>
                                                    {"每圈旋轉: "}
                                                    {isNaN(parseInt(moduleData.x_y_axis_max))? parseInt(moduleDataP.x_y_axis_max): parseInt(moduleData.x_y_axis_max)}
                                                    {"微步 / "}{(isNaN(parseInt(moduleData.x_y_axis_one_time_step))? parseFloat(moduleDataP.x_y_axis_one_time_step): parseFloat(moduleData.x_y_axis_one_time_step))}
                                                    {"微步 = "}
                                                    { (isNaN(parseInt(moduleData.x_y_axis_max))? parseFloat(moduleDataP.x_y_axis_max): parseFloat(moduleData.x_y_axis_max)) / 
                                                    (isNaN(parseInt(moduleData.x_y_axis_one_time_step))? parseFloat(moduleDataP.x_y_axis_one_time_step): parseFloat(moduleData.x_y_axis_one_time_step)) }
                                                    {"次"}
                                                </Form.Text>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>X Y軸每次旋轉微步(需是6400的因數)</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.x_y_axis_one_time_step}
                                                    defaultValue={moduleData.x_y_axis_one_time_step}
                                                    onChange={(e) => setModuleChange('x_y_axis_one_time_step', e.target.value)}
                                                />
                                                <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                                <Form.Text muted>
                                                    {"每次旋轉角度: (1.8度 / 32微步) *"}
                                                    {isNaN(parseInt(moduleData.x_y_axis_one_time_step))? parseInt(moduleDataP.x_y_axis_one_time_step): parseInt(moduleData.x_y_axis_one_time_step)}
                                                    {"微步 *  = "}{(isNaN(parseInt(moduleData.x_y_axis_one_time_step))? parseFloat(moduleDataP.x_y_axis_one_time_step): parseFloat(moduleData.x_y_axis_one_time_step)) * (1.8 / 32)}
                                                    {"度"}
                                                </Form.Text>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>X Y軸速度(每轉一次需要等待雷射測距測量完畢)</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.x_y_axis_step_delay_time}
                                                    defaultValue={moduleData.x_y_axis_step_delay_time}
                                                    onChange={(e) => setModuleChange('x_y_axis_step_delay_time', e.target.value)}
                                                />
                                                <InputGroup.Text>delayMicroseconds</InputGroup.Text>
                                            </InputGroup>
                                            <Form.Text muted>
                                                {"每1圈旋轉時間: "}
                                                { (isNaN(parseInt(moduleData.x_y_axis_max))? parseFloat(moduleDataP.x_y_axis_max): parseFloat(moduleData.x_y_axis_max))}
                                                {"微步 * "}
                                                { (isNaN(parseInt(moduleData.x_y_axis_step_delay_time))? parseFloat(moduleDataP.x_y_axis_step_delay_time): parseFloat(moduleData.x_y_axis_step_delay_time))}
                                                {"µs + "}
                                                {parseFloat(moduleData.vl53l1x_timeing_budget)}
                                                {"ms * "}
                                                { (isNaN(parseInt(moduleData.x_y_axis_max))? parseFloat(moduleDataP.x_y_axis_max): parseFloat(moduleData.x_y_axis_max)) / 
                                                  (isNaN(parseInt(moduleData.x_y_axis_one_time_step))? parseFloat(moduleDataP.x_y_axis_one_time_step): parseFloat(moduleData.x_y_axis_one_time_step)) }
                                                {"圈 = "}
                                                { ((isNaN(parseInt(moduleData.x_y_axis_max))? parseFloat(moduleDataP.x_y_axis_max): parseFloat(moduleData.x_y_axis_max)) *
                                                   (isNaN(parseInt(moduleData.x_y_axis_step_delay_time))? parseFloat(moduleDataP.x_y_axis_step_delay_time): parseFloat(moduleData.x_y_axis_step_delay_time)) / 500000 ) + 
                                                  ((parseFloat(moduleData.vl53l1x_timeing_budget) / 1000) * 
                                                   (isNaN(parseInt(moduleData.x_y_axis_max))? parseFloat(moduleDataP.x_y_axis_max): parseFloat(moduleData.x_y_axis_max)) / 
                                                   (isNaN(parseInt(moduleData.x_y_axis_one_time_step))? parseFloat(moduleDataP.x_y_axis_one_time_step): parseFloat(moduleData.x_y_axis_one_time_step))) *
                                                   (isNaN(parseInt(moduleData.x_y_axis_check_times))? parseFloat(moduleDataP.x_y_axis_check_times): parseFloat(moduleData.x_y_axis_check_times))}
                                                {"秒"}
                                            </Form.Text>

                                        </Form.Group>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>X Y軸掃描次數(越大越準 1~5)</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.x_y_axis_check_times}
                                                    defaultValue={moduleData.x_y_axis_check_times}
                                                    onChange={(e) => setModuleChange('x_y_axis_check_times', e.target.value)}
                                                />
                                                <InputGroup.Text>次</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <div className="border-bottom border-2 p-2" />
                                    </Row>
                                    <Row className='py-2'>
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>雷射測距</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    required
                                                    disabled
                                                    type="text"
                                                    value={stopMsg.vl53l1x === -1 ? "未安裝 vl53l1x" : stopMsg.vl53l1x}
                                                    onChange={(e) => (isNaN(parseInt(e.target.value))? 1: parseInt(e.target.value))}
                                                />
                                                <InputGroup.Text>mm</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>雷射中心點</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder={moduleDataP.vl53l1x_center}
                                                    defaultValue={moduleData.vl53l1x_center}
                                                    onChange={(e) => setModuleChange('vl53l1x_center', e.target.value)}
                                                />
                                                <InputGroup.Text>mm</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>雷射 Timeing Budget</Form.Label>
                                            <InputGroup>
                                                <Form.Select value={moduleData.vl53l1x_timeing_budget}
                                                    onChange={(e) => setModuleChange('vl53l1x_timeing_budget', e.target.value)}> 
                                                    <option value={15} className='text-info'>15 (VL53L1X)</option>
                                                    <option value={20} className='text-primary'>20 (VL53L0X, VL53L1X)</option>
                                                    <option value={33} className='text-primary'>33 (VL53L0X, VL53L1X)</option>
                                                    <option value={50} className='text-info'>50 (VL53L1X)</option>
                                                    <option value={100} className='text-info'>100 (VL53L1X)</option>
                                                    <option value={200} className='text-success'>200 (VL53L0X)</option>
                                                    <option value={500} className='text-info'>500 (VL53L1X)</option>
                                                </Form.Select>
                                                <InputGroup.Text>ms</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </Row>
                                    <div className="border-bottom border-2 p-2" />
                                    <Row className='py-2'>
                                        <Form.Group as={Col} md={4}>
                                            <Form.Label>目前Z軸位置</Form.Label>
                                            <InputGroup className="mb-4">
                                                <Form.Control
                                                    required
                                                    disabled
                                                    type="text"
                                                    value={stopMsg.z_steps}
                                                    onChange={(e) => (isNaN(parseInt(e.target.value))? 1: parseInt(e.target.value))}
                                                />
                                                <InputGroup.Text> / 47000</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group as={Col} md={4}>
                                            <Form.Label as={Col}>Z軸步數</Form.Label>
                                            <Form.Group as={Col}>
                                                <InputGroup className="mb-3">
                                                    <Form.Control
                                                        required
                                                        value={zAxisSteps}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setZAxisSteps(value === '' || isNaN(parseInt(value)) ? 1 : parseInt(value));
                                                        }}
                                                        type="text"
                                                        placeholder="1"
                                                    />
                                                    <InputGroup.Text>微步</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Form.Group>
                                        <Form.Group as={Col} md={4}>
                                            <ButtonGroup as={Col} md={12}>
                                                <Button onClick={() => zAxisButtonClick("up", zAxisSteps)} variant="outline-primary" className='mt-4' size="lg">往上</Button>
                                                <Button onClick={() => zAxisButtonClick("home")} variant="outline-primary" className='mt-4' size="lg">歸位</Button>
                                                <Button onClick={() => zAxisButtonClick("down", zAxisSteps)} variant="outline-primary" className='mt-4' size="lg">往下</Button>
                                            </ButtonGroup>
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container>
        </main>

    ) ;

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default Setting ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
