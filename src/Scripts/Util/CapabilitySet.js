/**
 * Developer    :   SongQian
 * Time         :   2019-06-28
 * eMain        :   onlylove1172559463@vip.qq.com
 * Description  :   智能机箱业务能力集数据信息封装
 */
export class CapabilityFactory {

    constructor() {
        if(!CapabilityFactory.capability)
            return this;
        throw new Error('CapabilityFactory cannot be instantiated with the new keyword');
    }
    //能力集键名
    static capabilitySet = ['DEV_TEMP', 'DEV_INNER_VOL', 'DEV_HUMIDITY', 'DEV_POWER_STATUS', 'PORT_ADMIN_STATUS', 'PORT_LINK_STATUS', 'PORT_LINK_SPEED', 'PORT_LINK_TYPE', 'PORT_FLUX', 'OUT_POWER_STATUS', 'OUTPUT_POWER_VOL', 'OUTPUT_POWER_CURRENT', 'FAN_MODE', 'FAN_TEMP_THRESHOLD', 'FAN_CFG_STATUS', 'FAN_WORK_STATUS', 'FAN_POWER_ID', 'DOOR_DEFENCE_STATUS', 'DOOR_STATUS', 'LOCKTONGUE_STATUS', 'DEV_POWER_RATE', 'INPUT_VOLT', 'INPUT_CURRENT', 'DEV_ENERGY', 'THUNDER_DEFENCE', 'FAN_SPEED', 'LEAN_ANGLE', 'LEAN_THRESHOLD', 'DEV_LIGHT', 'DEV_NOISE', 'PM_2_5', 'PM_10', 'DEV_SHARK', 'DEV_VISIBLE', 'RAIN_FALL', 'WIND_SPEED', 'WIND_DIRECTION', 'SWITCH_STATUS', 'HEATER_MODE', 'HEATER_TEMP_THRESHOLD', 'HEATER_WORK_STATUS', 'HEATER_POWER_ID', 'WIFI_STATUS', 'PLAN_ENABLE', 'PLAN_TIME_SCHEDULE', 'NET_MONITOR_ENABLE', 'PING_INTERVAL', 'PACKET_LOSS_THRESHOLD', 'DELAY_TIME_THRESHOLD', 'LOCK_TYPE', 'UPS_STATUS', 'STORE_STATUS', 'COLDER_STATUS', 'COLDER_STATUS', 'AUTO_RECLOSE_COUNT', 'AUTO_RECLOSE_REASON', 'VOLT_HIGH_THRESHOLD', 'VOLT_LOW_THRESHOLD', 'ELECTRICITY_LEAKAGE_THRESHOLD', 'SMOKE_STATUS', 'BEACON_ISEXIST', 'BEACON_FAULT_STATUS', 'BEACON_STATUS', 'BEACON_VOLT', 'COUNTDOWN_STATUS', 'COUNTDOWN_STARTTIME', 'COUNTDOWN_TIME', 'AIRSWITCH_STATUS', 'SIGNAL_POWER', 'SIGNAL_LEARN', 'WATER_STATUS', 'OUTPUT_POWER_MODE', 'PER_OUTPUT_POWER_NAME', 'PER_BACK_DOOR_STATUS'];

    static capability = null;

    static getInstance() {
        if(!CapabilityFactory.capability) {
            CapabilityFactory.capability = new CapabilityFactory();
            return CapabilityFactory.capability;
        }
        return CapabilityFactory.capability;
    }

    createCapability(type, capability) {
        if(CapabilityFactory.capabilitySet.indexOf(type) > -1) {
            let { id, perform_name, perform_type, data_type, perform_value, perform_description } = capability;
            switch(type) {
                case "DEV_TEMP" :
                    return new DEV_TEMP(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_INNER_VOL" :
                    return new DEV_INNER_VOL(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_HUMIDITY" :
                    return new DEV_HUMIDITY(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_POWER_STATUS" :
                    return new DEV_POWER_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PORT_ADMIN_STATUS" :
                    return new PORT_ADMIN_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PORT_LINK_STATUS" :
                    return new PORT_LINK_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PORT_LINK_SPEED" :
                    return new PORT_LINK_SPEED(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PORT_LINK_TYPE" :
                    return new PORT_LINK_TYPE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PORT_FLUX" :
                    return new PORT_FLUX(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "OUT_POWER_STATUS" :
                    return new OUT_POWER_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "OUTPUT_POWER_VOL" :
                    return new OUTPUT_POWER_VOL(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "OUTPUT_POWER_CURRENT" :
                    return new OUTPUT_POWER_CURRENT(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "FAN_MODE" :
                    return new FAN_MODE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "FAN_TEMP_THRESHOLD" :
                    return new FAN_TEMP_THRESHOLD(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "FAN_CFG_STATUS" :
                    return new FAN_CFG_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "FAN_WORK_STATUS" :
                    return new FAN_WORK_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "FAN_POWER_ID" :
                    return new FAN_POWER_ID(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DOOR_DEFENCE_STATUS" :
                    return new DOOR_DEFENCE_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DOOR_STATUS" :
                    return new DOOR_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "LOCKTONGUE_STATUS" :
                    return new LOCKTONGUE_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_POWER_RATE" :
                    return new DEV_POWER_RATE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "INPUT_VOLT" :
                    return new INPUT_VOLT(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "INPUT_CURRENT" :
                    return new INPUT_CURRENT(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_ENERGY" :
                    return new DEV_ENERGY(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "THUNDER_DEFENCE" :
                    return new THUNDER_DEFENCE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "FAN_SPEED" :
                    return new FAN_SPEED(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "LEAN_ANGLE" :
                    return new LEAN_ANGLE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "LEAN_THRESHOLD" :
                    return new LEAN_THRESHOLD(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_LIGHT" :
                    return new DEV_LIGHT(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_NOISE" :
                    return new DEV_NOISE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PM_2_5" :
                    return new PM_2_5(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PM_10" :
                    return new PM_10(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_SHARK" :
                    return new DEV_SHARK(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DEV_VISIBLE" :
                    return new DEV_VISIBLE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "RAIN_FALL" :
                    return new RAIN_FALL(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "WIND_SPEED" :
                    return new WIND_SPEED(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "WIND_DIRECTION" :
                    return new WIND_DIRECTION(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "SWITCH_STATUS" :
                    return new SWITCH_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "HEATER_MODE" :
                    return new HEATER_MODE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "HEATER_TEMP_THRESHOLD" :
                    return new HEATER_TEMP_THRESHOLD(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "HEATER_WORK_STATUS" :
                    return new HEATER_WORK_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "HEATER_POWER_ID" :
                    return new HEATER_POWER_ID(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "WIFI_STATUS" :
                    return new WIFI_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PLAN_ENABLE" :
                    return new PLAN_ENABLE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PLAN_TIME_SCHEDULE" :
                    return new PLAN_TIME_SCHEDULE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "NET_MONITOR_ENABLE" :
                    return new NET_MONITOR_ENABLE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PING_INTERVAL" :
                    return new PING_INTERVAL(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PACKET_LOSS_THRESHOLD" :
                    return new PACKET_LOSS_THRESHOLD(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "DELAY_TIME_THRESHOLD" :
                    return new DELAY_TIME_THRESHOLD(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "LOCK_TYPE" :
                    return new LOCK_TYPE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "UPS_STATUS" :
                    return new UPS_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "STORE_STATUS" :
                    return new STORE_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "COLDER_STATUS" :
                    return new COLDER_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "COLDER_STATUS" :
                    return new COLDER_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "AUTO_RECLOSE_COUNT" :
                    return new AUTO_RECLOSE_COUNT(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "AUTO_RECLOSE_REASON" :
                    return new AUTO_RECLOSE_REASON(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "VOLT_HIGH_THRESHOLD" :
                    return new VOLT_HIGH_THRESHOLD(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "VOLT_LOW_THRESHOLD" :
                    return new VOLT_LOW_THRESHOLD(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "ELECTRICITY_LEAKAGE_THRESHOLD" :
                    return new ELECTRICITY_LEAKAGE_THRESHOLD(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "SMOKE_STATUS" : 
                    return new SMOKE_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "BEACON_ISEXIST" :
                    return new BEACON_ISEXIST(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "BEACON_FAULT_STATUS" :
                    return new BEACON_FAULT_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "BEACON_STATUS" :
                    return new BEACON_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "BEACON_VOLT" :
                    return new BEACON_VOLT(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "COUNTDOWN_STATUS" : 
                    return new COUNTDOWN_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "COUNTDOWN_STARTTIME" :
                    return new COUNTDOWN_STARTTIME(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "COUNTDOWN_TIME" :
                    return new COUNTDOWN_TIME(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "AIRSWITCH_STATUS" :
                    return new AIRSWITCH_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "SIGNAL_POWER" :
                    return new SIGNAL_POWER(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "SIGNAL_LEARN" :
                    return new SIGNAL_LEARN(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "WATER_STATUS" :
                    return new WATER_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "OUTPUT_POWER_MODE" :
                    return new OUTPUT_POWER_MODE(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PER_OUTPUT_POWER_NAME" : 
                    return new PER_OUTPUT_POWER_NAME(id, perform_name, perform_type, data_type, perform_value, perform_description);
                case "PER_BACK_DOOR_STATUS" :
                    return new PER_BACK_DOOR_STATUS(id, perform_name, perform_type, data_type, perform_value, perform_description);
            }
        }
        return null;
    }
}

export class CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        this.$id = id;
        this.$perform_name = perform_name;
        this.$perform_type = perform_type;
        this.$data_type = data_type;
        this.$perform_value = perform_value;
        this.$perform_description = perform_description;
    }

    get id() {
        return this.$id;
    }

    get perform_name() {
        return this.$perform_name;
    }

    get perform_type() {
        return this.$perform_type;
    }

    get data_type() {
        return this.$data_type;
    }

    get perform_value() {
        return this.$perform_value;
    }

    get perform_description() {
        return this.$perform_description;
    }

    //抽象能力集中的格式化函数
    valueOf() {
        throw new Error(`${this.name} failed to override valueOf function`);
    }

    map(done) {
        if(typeof this[Symbol.iterator][Symbol.hasInstance] !== "function")
            throw new Error("current CapabilityBasic.map not a function");
        let result = [];
        for(let item of this)
            result.push(done(item))
        return result;
    }
}

/**
 * 设备温度
 */
export class DEV_TEMP extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}℃';

    valueOf() {
        if(DEV_TEMP.formatter instanceof Array)
            return DEV_TEMP.formatter[this.perform_value];

        if(Object.prototype.toString.call(DEV_TEMP.formatter) == "[object String]")
            return DEV_TEMP.formatter.replace(/(\{value\})/g, Math.round(this.perform_value * 100) / 100);

        return null;
    }

}

/**
 * 设备内部电压
 */
export class DEV_INNER_VOL extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}V';

    get perform_value() {
        let perform_value = this.$perform_value.replace(/\[/g, "[\"").replace(/\]/g, "\"]").replace(/(?!\])\,(?!\[)/g, "\",\"");
        return JSON.parse(perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        // return this.map(
        //     ([n, v]) => ([ n, DEV_INNER_VOL.formatter.replace(/(\{value\})/g, v), true])
        // );
        if(DEV_INNER_VOL.formatter instanceof Array)
            return this.perform_value.map((n, v) => {
                return [n, v[0], DEV_INNER_VOL.formatter.replace(/(\{value\})/g, v[1])]
            });

        if(Object.prototype.toString.call(DEV_INNER_VOL.formatter) == "[object String]")
            return DEV_INNER_VOL.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 湿度
 */
export class DEV_HUMIDITY extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}%';

    valueOf() {
        if(DEV_HUMIDITY.formatter instanceof Array)
            return DEV_HUMIDITY.formatter[this.perform_value];

        if(Object.prototype.toString.call(DEV_HUMIDITY.formatter) == "[object String]")
            return DEV_HUMIDITY.formatter.replace(/(\{value\})/g, Math.floor(parseFloat(this.perform_value) * 100) / 100);

        return null;
    }
}

/**
 * 设备电源状态
 */
export class DEV_POWER_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['未工作', '工作中'];

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }
    
    valueOf() {
        if(DEV_POWER_STATUS.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, DEV_POWER_STATUS.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(DEV_POWER_STATUS.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, DEV_POWER_STATUS.formatter.replace(/(\{value\})/g, v), v === 1])
            )
        return null;
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 端口开关状态
 */
export class PORT_ADMIN_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关闭', '开启'];

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }
    
    valueOf() {
        if(PORT_ADMIN_STATUS.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, PORT_ADMIN_STATUS.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(PORT_ADMIN_STATUS.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, PORT_ADMIN_STATUS.formatter.replace(/(\{value\})/g, v), v === 1])
            )
        return null;
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 端口Link状态
 */
export class PORT_LINK_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关闭', '开启'];

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }
    
    valueOf() {
        if(PORT_LINK_STATUS.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, PORT_LINK_STATUS.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(PORT_LINK_STATUS.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, PORT_LINK_STATUS.formatter.replace(/(\{value\})/g, v), v === 1])
            )
        return null;
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 端口link速率
 */
export class PORT_LINK_SPEED extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}M';

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        return this.map(
            ([n, v]) => ([ n, PORT_LINK_SPEED.formatter.replace(/(\{value\})/g, v), true])
        );
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 端口link类型
 */
export class PORT_LINK_TYPE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['', '电口', '光口'];

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(PORT_LINK_TYPE.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([ n, PORT_LINK_TYPE.formatter[v], true])
            );
        if(Object.prototype.toString.call(PORT_LINK_TYPE.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, PORT_LINK_TYPE.formatter.replace(/(\{value\})/g, v), true])
            );
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 端口实时流量
 */
export class PORT_FLUX extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }
    
    static formatter = '{value}M';

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        return this.map(
            ([n, v]) => ([ n, PORT_FLUX.formatter.replace(/(\{value\})/g, Math.floor( v / 1024 / 1024 * 100) / 100), true])
        );
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 输出电源开关状态
 */

export class OUT_POWER_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        return this.map(
            ([n, v]) => ([ n, OUT_POWER_STATUS.formatter.replace(/(\{value\})/g, v), true])
        );
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 输出电源电压
 */
export class OUTPUT_POWER_VOL extends CapabilityBasic {
     
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }
    
    static formatter = '{value}V';

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        return this.map(
            ([n, v]) => ([ n, OUTPUT_POWER_VOL.formatter.replace(/(\{value\})/g, v), true])
        );
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 输出电源电流
 */
export class OUTPUT_POWER_CURRENT extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}A';

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        return this.map(
            ([n, v]) => ([ n, OUTPUT_POWER_CURRENT.formatter.replace(/(\{value\})/g, v), true])
        );
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 风扇工作模式
 */
export class FAN_MODE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['手动控制模式', '温度控制模式'];

    valueOf() {
        if(FAN_MODE.formatter instanceof Array)
            return FAN_MODE.formatter[this.perform_value];

        if(Object.prototype.toString.call(FAN_MODE.formatter) == "[object String]")
            return FAN_MODE.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 风扇工作温度阈值
 */
export class FAN_TEMP_THRESHOLD extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}℃';

    valueOf() {
        if(FAN_TEMP_THRESHOLD.formatter instanceof Array)
            return FAN_TEMP_THRESHOLD.formatter[this.perform_value];

        if(Object.prototype.toString.call(FAN_TEMP_THRESHOLD.formatter) == "[object String]")
            return FAN_TEMP_THRESHOLD.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 风扇开关状态
 */
export class FAN_CFG_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关闭', '打开'];

    valueOf() {
        if(FAN_CFG_STATUS.formatter instanceof Array)
            return FAN_CFG_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(FAN_CFG_STATUS.formatter) == "[object String]")
            return FAN_CFG_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 风扇工作状态
 */
export class FAN_WORK_STATUS extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }
    static formatter = ['未工作', '工作中'];

    valueOf() {
        if(FAN_WORK_STATUS.formatter instanceof Array)
            return FAN_WORK_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(FAN_WORK_STATUS.formatter) == "[object String]")
            return FAN_WORK_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 风扇电源端口
 */
export class FAN_POWER_ID extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(FAN_POWER_ID.formatter instanceof Array)
            return FAN_POWER_ID.formatter[this.perform_value];

        if(Object.prototype.toString.call(FAN_POWER_ID.formatter) == "[object String]")
            return FAN_POWER_ID.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/** 
* 门布防状态
*/
export class DOOR_DEFENCE_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['撤防', '布防'];

    valueOf() {
        if(DOOR_DEFENCE_STATUS.formatter instanceof Array)
            return DOOR_DEFENCE_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(DOOR_DEFENCE_STATUS.formatter) == "[object String]")
            return DOOR_DEFENCE_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 门状态
 */
export class DOOR_STATUS extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关闭', '打开'];

    valueOf() {
        if(DOOR_STATUS.formatter instanceof Array)
            return DOOR_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(DOOR_STATUS.formatter) == "[object String]")
            return DOOR_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 锁舌状态
 */
export class LOCKTONGUE_STATUS extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关闭', '打开'];

    
    valueOf() {
        if(LOCKTONGUE_STATUS.formatter instanceof Array)
            return LOCKTONGUE_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(LOCKTONGUE_STATUS.formatter) == "[object String]")
            return LOCKTONGUE_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 功率
 */
export class DEV_POWER_RATE extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}W';

    valueOf() {
        if(DEV_POWER_RATE.formatter instanceof Array)
            return DEV_POWER_RATE.formatter[this.perform_value];

        if(Object.prototype.toString.call(DEV_POWER_RATE.formatter) == "[object String]")
            return DEV_POWER_RATE.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 输入电压
 */
export class INPUT_VOLT extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}V';

    valueOf() {
        if(INPUT_VOLT.formatter instanceof Array)
            return INPUT_VOLT.formatter[this.perform_value];

        if(Object.prototype.toString.call(INPUT_VOLT.formatter) == "[object String]")
            return INPUT_VOLT.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 输入电流
 */
export class INPUT_CURRENT extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}mA';

    valueOf() {
        if(INPUT_CURRENT.formatter instanceof Array)
            return INPUT_CURRENT.formatter[this.perform_value];

        if(Object.prototype.toString.call(INPUT_CURRENT.formatter) == "[object String]")
            return INPUT_CURRENT.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 用电量
 */
export class DEV_ENERGY extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}KW';
    
    valueOf() {
        if(DEV_ENERGY.formatter instanceof Array)
            return DEV_ENERGY.formatter[this.perform_value];

        if(Object.prototype.toString.call(DEV_ENERGY.formatter) == "[object String]")
            return DEV_ENERGY.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 防雷信息
 */
export class THUNDER_DEFENCE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['不正常', '正常'];

    get perform_value() {
        return JSON.parse(
            this.$perform_value.replace(/^(\s?\{\s?)/g,'[')
            .replace(/(\s?\}\s?)$/g, ']')
            .replace(/(?:THUN_STATUS_\d+)/g,  v => {
                v = v.replace('THUN_STATUS_', '防雷器');
                return `"${v}"`
            }).replace(/(?:THUN_COUNT_\d+)/g, v => {
                v = v.replace('THUN_COUNT_', '雷击计数器');
                return `"${v}"`
            })
        )
    }

    valueOf() {
        let thuns = this.perform_value;
        // let thun_count = thuns.pop();
        if(THUNDER_DEFENCE.formatter instanceof Array)
            return [ ...thuns.map(
                (([n, v]) => ( [ n, THUNDER_DEFENCE.formatter[v], v === 1, v] ))
            )];

        if(Object.prototype.toString.call(THUNDER_DEFENCE.formatter) == "[object String]")
            return [ ...thuns.map(
                ([n, v]) => ([ n, THUNDER_DEFENCE.formatter.replace(/(\{value\})/g, v), v === 1, v])
            )];

        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }

}

/**
 * 风扇转速
 */
export class FAN_SPEED extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = "{value}/s";

    valueOf() {
        if(FAN_SPEED.formatter instanceof Array)
            return FAN_SPEED.formatter[this.perform_value];

        if(Object.prototype.toString.call(FAN_SPEED.formatter) == "[object String]")
            return FAN_SPEED.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }

}

/**
 * 倾斜角度
 */
export class LEAN_ANGLE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{d} {value}°';
    
    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }
    
    valueOf() {
        if(LEAN_ANGLE.formatter instanceof Array)
            return this.map(
                (([n, v]) => ( [ n, LEAN_ANGLE.formatter[v] ] ))
            );

        if(Object.prototype.toString.call(LEAN_ANGLE.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, LEAN_ANGLE.formatter.replace(/(\{value\})/g, v).replace(/(\{d\})/g, ['', '前','后', '左', '右', '上', '下'][n]), true])
            );

        return null;
    }

    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 倾斜角度阈值
 */
export class LEAN_THRESHOLD extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }
    
    static formatter = '{d} {value}°';
    
    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(LEAN_THRESHOLD.formatter instanceof Array)
            return this.map(
                ([n, v]) => ( [ n, LEAN_THRESHOLD.formatter[v], true] )
            );

        if(Object.prototype.toString.call(LEAN_THRESHOLD.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, LEAN_THRESHOLD.formatter.replace(/(\{value\})/g, v).replace(/(\{d\})/g, ['', '前','后', '左', '右', '上', '下'][n]), true])
            );

        return null;
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 光照
 */
export class DEV_LIGHT extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(DEV_LIGHT.formatter instanceof Array)
            return DEV_LIGHT.formatter[this.perform_value];

        if(Object.prototype.toString.call(DEV_LIGHT.formatter) == "[object String]")
            return DEV_LIGHT.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 噪音
 */
export class DEV_NOISE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}/dB';

    valueOf() {
        if(DEV_NOISE.formatter instanceof Array)
            return DEV_NOISE.formatter[this.perform_value];

        if(Object.prototype.toString.call(DEV_NOISE.formatter) == "[object String]")
            return DEV_NOISE.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * PM2.5
 */
export class PM_2_5 extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value} μg/m³';

    valueOf() {
        if(PM_2_5.formatter instanceof Array)
            return PM_2_5.formatter[this.perform_value];

        if(Object.prototype.toString.call(PM_2_5.formatter) == "[object String]")
            return PM_2_5.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * PM10
 */
export class PM_10 extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value} μg/m³';

    valueOf() {
        if(PM_10.formatter instanceof Array)
            return PM_10.formatter[this.perform_value];

        if(Object.prototype.toString.call(PM_10.formatter) == "[object String]")
            return PM_10.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 震动
 */
export class DEV_SHARK extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(DEV_SHARK.formatter instanceof Array)
            return DEV_SHARK.formatter[this.perform_value];

        if(Object.prototype.toString.call(DEV_SHARK.formatter) == "[object String]")
            return DEV_SHARK.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 可见度
 */
export class DEV_VISIBLE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(DEV_VISIBLE.formatter instanceof Array)
            return DEV_VISIBLE.formatter[this.perform_value];

        if(Object.prototype.toString.call(DEV_VISIBLE.formatter) == "[object String]")
            return DEV_VISIBLE.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 雨量
 */
export class RAIN_FALL extends CapabilityBasic {
     
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(RAIN_FALL.formatter instanceof Array)
            return RAIN_FALL.formatter[this.perform_value];

        if(Object.prototype.toString.call(RAIN_FALL.formatter) == "[object String]")
            return RAIN_FALL.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
 }

 /**
  * 风速
  */
export class WIND_SPEED extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(WIND_SPEED.formatter instanceof Array)
            return WIND_SPEED.formatter[this.perform_value];

        if(Object.prototype.toString.call(WIND_SPEED.formatter) == "[object String]")
            return WIND_SPEED.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}
/**
 * 风向
 */
export class WIND_DIRECTION extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(WIND_DIRECTION.formatter instanceof Array)
            return WIND_DIRECTION.formatter[this.perform_value];

        if(Object.prototype.toString.call(WIND_DIRECTION.formatter) == "[object String]")
            return WIND_DIRECTION.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 空开状态
 */
export class SWITCH_STATUS extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['不在位', '在位'];
    
    valueOf() {
        if(SWITCH_STATUS.formatter instanceof Array)
            return SWITCH_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(SWITCH_STATUS.formatter) == "[object String]")
            return SWITCH_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }

}

/**
 * 加热器工作模式
 */
export class HEATER_MODE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }
    
    static formatter = ['手动控制模式', '温度控制模式'];

    valueOf() {
        if(HEATER_MODE.formatter instanceof Array)
            return HEATER_MODE.formatter[this.perform_value];

        if(Object.prototype.toString.call(HEATER_MODE.formatter) == "[object String]")
            return HEATER_MODE.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 加热器工作温度阈值
 */
export class HEATER_TEMP_THRESHOLD extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}℃';

    valueOf() {
        if(HEATER_TEMP_THRESHOLD.formatter instanceof Array)
            return HEATER_TEMP_THRESHOLD.formatter[this.perform_value];

        if(Object.prototype.toString.call(HEATER_TEMP_THRESHOLD.formatter) == "[object String]")
            return HEATER_TEMP_THRESHOLD.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 加热器工作状态
 */
export class HEATER_WORK_STATUS extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['未工作', '工作中'];

    valueOf() {
        if(HEATER_WORK_STATUS.formatter instanceof Array)
            return HEATER_WORK_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(HEATER_WORK_STATUS.formatter) == "[object String]")
            return HEATER_WORK_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 加热器电源端口
 */
export class HEATER_POWER_ID extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';
    
    valueOf() {
        if(HEATER_POWER_ID.formatter instanceof Array)
            return HEATER_POWER_ID.formatter[this.perform_value];

        if(Object.prototype.toString.call(HEATER_POWER_ID.formatter) == "[object String]")
            return HEATER_POWER_ID.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 无线开关
 */
export class WIFI_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }
    
    static formatter = ['未工作', '工作中'];

    valueOf() {
        if(WIFI_STATUS.formatter instanceof Array)
            return WIFI_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(WIFI_STATUS.formatter) == "[object String]")
            return WIFI_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 电源计划开启开关
 */
export class PLAN_ENABLE extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关', '开'];

    valueOf() {
        if(PLAN_ENABLE.formatter instanceof Array)
            return PLAN_ENABLE.formatter[this.perform_value];

        if(Object.prototype.toString.call(PLAN_ENABLE.formatter) == "[object String]")
            return PLAN_ENABLE.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 电源计划开启时间
 */
export class PLAN_TIME_SCHEDULE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['{value} - {value}', '{value} - {value}', '{value} - {value}', '{value} - {value}'];

    get perform_value() {
        return this.$perform_value.split(/\@/g);
    }

    valueOf() {
        if(PLAN_TIME_SCHEDULE.formatter instanceof Array) {
            let [springStart, springEnd, summerStart, summerEnd, autumnStart, autumnEnd, winterStart, winterEnd] = this;
            let season = [ [springStart, springEnd], [summerStart, summerEnd], [autumnStart, autumnEnd], [winterStart, winterEnd] ];
            return PLAN_TIME_SCHEDULE.formatter.map(
                (it, n) => ( [ it.replace(/^(\{value\})/, season[n][0]), it.replace(/(\{value\})$/, season[n][1])] )
            );
        }
        
        if(Object.prototype.toString.call(PLAN_TIME_SCHEDULE.formatter) == "[object String]") {
            let result = PLAN_TIME_SCHEDULE.formatter;
            for(let i in result.split(/(\{value\})/g)) {
                result = result.replace(/(\{value\})/, this[i] || '');
            }
            return result;
        }
        return null;
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value)
            yield item;
    }
}

/**
 * 网络监测开关
 */
export class NET_MONITOR_ENABLE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关闭', '打开'];


    valueOf() {
        if(NET_MONITOR_ENABLE.formatter instanceof Array)
            return NET_MONITOR_ENABLE.formatter[this.perform_value];

        if(Object.prototype.toString.call(NET_MONITOR_ENABLE.formatter) == "[object String]")
            return NET_MONITOR_ENABLE.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * Ping间隔时间
 */
export class PING_INTERVAL extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }
    
    static formatter = '{value}/min';

    valueOf() {
        if(PING_INTERVAL.formatter instanceof Array)
            return PING_INTERVAL.formatter[this.perform_value];

        if(Object.prototype.toString.call(PING_INTERVAL.formatter) == "[object String]")
            return PING_INTERVAL.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 丢包率阈值
 */
export class PACKET_LOSS_THRESHOLD extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}%';

    valueOf() {
        if(PACKET_LOSS_THRESHOLD.formatter instanceof Array)
            return PACKET_LOSS_THRESHOLD.formatter[this.perform_value];

        if(Object.prototype.toString.call(PACKET_LOSS_THRESHOLD.formatter) == "[object String]")
            return PACKET_LOSS_THRESHOLD.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 延时阈值
 */
export class DELAY_TIME_THRESHOLD extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}ms';
    
    valueOf() {
        if(DELAY_TIME_THRESHOLD.formatter instanceof Array)
            return DELAY_TIME_THRESHOLD.formatter[this.perform_value];

        if(Object.prototype.toString.call(DELAY_TIME_THRESHOLD.formatter) == "[object String]")
            return DELAY_TIME_THRESHOLD.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 锁类型
 */
export class LOCK_TYPE extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['机械锁', '智能锁', '未知锁', '电磁锁'];
    
    valueOf() {
        if(LOCK_TYPE.formatter instanceof Array)
            return LOCK_TYPE.formatter[this.perform_value];

        if(Object.prototype.toString.call(LOCK_TYPE.formatter) == "[object String]")
            return LOCK_TYPE.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * UPS状态
 */
export class UPS_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(UPS_STATUS.formatter instanceof Array)
            return UPS_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(UPS_STATUS.formatter) == "[object String]")
            return UPS_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 前端存储状态
 */
export class STORE_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';

    valueOf() {
        if(STORE_STATUS.formatter instanceof Array)
            return STORE_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(STORE_STATUS.formatter) == "[object String]")
            return STORE_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 制冷状态
 */
export class COLDER_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}';
    
    valueOf() {
        if(COLDER_STATUS.formatter instanceof Array)
            return COLDER_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(COLDER_STATUS.formatter) == "[object String]")
            return COLDER_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }

}

/**
 * 开箱抓拍状态
 */
export class CAPTURE_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关', '开'];
    
    valueOf() {
        if(CAPTURE_STATUS.formatter instanceof Array)
            return CAPTURE_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(CAPTURE_STATUS.formatter) == "[object String]")
            return CAPTURE_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 自动重合闸跳闸次数
 */
export class AUTO_RECLOSE_COUNT extends CapabilityBasic {
 
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}次'
    
    valueOf() {
        if(AUTO_RECLOSE_COUNT.formatter instanceof Array)
            return AUTO_RECLOSE_COUNT.formatter[this.perform_value];

        if(Object.prototype.toString.call(AUTO_RECLOSE_COUNT.formatter) == "[object String]")
            return AUTO_RECLOSE_COUNT.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 自动重合闸跳闸原因
 */
export class AUTO_RECLOSE_REASON extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}'
    
    valueOf() {
        if(AUTO_RECLOSE_REASON.formatter instanceof Array)
            return AUTO_RECLOSE_REASON.formatter[this.perform_value];

        if(Object.prototype.toString.call(AUTO_RECLOSE_REASON.formatter) == "[object String]")
            return AUTO_RECLOSE_REASON.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 过压阈值
 */
export class VOLT_HIGH_THRESHOLD extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}V'
    
    valueOf() {
        if(VOLT_HIGH_THRESHOLD.formatter instanceof Array)
            return VOLT_HIGH_THRESHOLD.formatter[this.perform_value];

        if(Object.prototype.toString.call(VOLT_HIGH_THRESHOLD.formatter) == "[object String]")
            return VOLT_HIGH_THRESHOLD.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 欠压阈值
 */
export class VOLT_LOW_THRESHOLD extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}V'
    
    valueOf() {
        if(VOLT_LOW_THRESHOLD.formatter instanceof Array)
            return VOLT_LOW_THRESHOLD.formatter[this.perform_value];

        if(Object.prototype.toString.call(VOLT_LOW_THRESHOLD.formatter) == "[object String]")
            return VOLT_LOW_THRESHOLD.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 漏电阈值
 */
export class ELECTRICITY_LEAKAGE_THRESHOLD extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = '{value}A'
    
    valueOf() {
        if(ELECTRICITY_LEAKAGE_THRESHOLD.formatter instanceof Array)
            return ELECTRICITY_LEAKAGE_THRESHOLD.formatter[this.perform_value];

        if(Object.prototype.toString.call(ELECTRICITY_LEAKAGE_THRESHOLD.formatter) == "[object String]")
            return ELECTRICITY_LEAKAGE_THRESHOLD.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 烟雾
 */
export class SMOKE_STATUS extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['无烟','有烟'];

    valueOf() {
        if(SMOKE_STATUS.formatter instanceof Array)
            return SMOKE_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(SMOKE_STATUS.formatter) == "[object String]")
            return SMOKE_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 信号灯状态
 */
export class BEACON_ISEXIST extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['未接', '接入'];
    
    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }
    
    valueOf() {
        if(BEACON_ISEXIST.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, BEACON_ISEXIST.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(BEACON_ISEXIST.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, BEACON_ISEXIST.formatter.replace(/(\{value\})/g, v), v === 1])
            )
        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 信号灯故障状态
 */
export class BEACON_FAULT_STATUS extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = ["故障", "正常"];

    
    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(BEACON_FAULT_STATUS.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, BEACON_FAULT_STATUS.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(BEACON_FAULT_STATUS.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, BEACON_FAULT_STATUS.formatter.replace(/(\{value\})/g, v), v === 1])
            )
        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 信号灯亮灭状态
 */
export class BEACON_STATUS extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = ["灭", "亮", "黄闪"];

    get perform_value() {
        let perform_value = this.$perform_value.replace(/\[/g, "[\"").replace(/\]/g, "\"]").replace(/(?!\])\,(?!\[)/g, "\",\"");
        return JSON.parse(perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(BEACON_STATUS.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, BEACON_STATUS.formatter[v], v == 1])
            )
        else if(Object.prototype.toString.call(BEACON_STATUS.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, BEACON_STATUS.formatter.replace(/(\{value\})/g, v), v == 1])
            )
        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 信号灯电压
 */
export class BEACON_VOLT extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = "{value}V";

    
    get perform_value() {
        // let perform_value = this.$perform_value.replace(/\[/g, "[\"").replace(/\]/g, "\"]").replace(/(?!\])\,(?!\[)/g, "\",\"");
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(BEACON_VOLT.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, BEACON_VOLT.formatter[v], v !== 0])
            )
        else if(Object.prototype.toString.call(BEACON_VOLT.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, BEACON_VOLT.formatter.replace(/(\{value\})/g, v), v !== 0])
            )
        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 智能交通空开状态
 */
export class AIRSWITCH_STATUS extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = ["开闸", "合闸"];

    get perform_value() {
        // let perform_value = this.$perform_value.replace(/\[/g, "[\"").replace(/\]/g, "\"]").replace(/(?!\])\,(?!\[)/g, "\",\"");
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(AIRSWITCH_STATUS.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, AIRSWITCH_STATUS.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(AIRSWITCH_STATUS.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, AIRSWITCH_STATUS.formatter.replace(/(\{value\})/g, v), v === 1])
            )
        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 倒计时状态
 */
export class COUNTDOWN_STATUS extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = ["异常", "正常"];

    get perform_value() {
        // let perform_value = this.$perform_value.replace(/\[/g, "[\"").replace(/\]/g, "\"]").replace(/(?!\])\,(?!\[)/g, "\",\"");
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(COUNTDOWN_STATUS.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, COUNTDOWN_STATUS.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(COUNTDOWN_STATUS.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, COUNTDOWN_STATUS.formatter.replace(/(\{value\})/g, v), v === 1])
            )
        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 倒计时器开始时间
 */
export class COUNTDOWN_STARTTIME extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = "{value}";

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(COUNTDOWN_STARTTIME.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([ n, COUNTDOWN_STARTTIME.formatter[v], true] )
            );

        if(Object.prototype.toString.call(COUNTDOWN_STARTTIME.formatter) == "[object String]")
            return this.map(
                ([n, v]) => {
                    var date = new Date(v * 1000);
                    var time = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                    return [n, COUNTDOWN_STARTTIME.formatter.replace(/(\{value\})/g, time), true];
                }
            );

        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 倒计时倒计时时长
 */
export class COUNTDOWN_TIME extends CapabilityBasic {
    
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = "{value}s";

    get perform_value() {
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(COUNTDOWN_TIME.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([ n, COUNTDOWN_TIME.formatter[v], true] )
            );

        if(Object.prototype.toString.call(COUNTDOWN_TIME.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, COUNTDOWN_TIME.formatter.replace(/(\{value\})/g, v), true])
            );

        return null;
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 各供电电源电压
 */
export class SIGNAL_POWER extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = "{value}V";

    get perform_value() {
        // let perform_value = this.$perform_value.replace(/\[/g, "[\"").replace(/\]/g, "\"]").replace(/(?!\])\,(?!\[)/g, "\",\"");
        return JSON.parse(this.$perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }
    
    valueOf() {
        if(SIGNAL_POWER.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, SIGNAL_POWER.formatter[v], v !== 0])
            )
        else if(Object.prototype.toString.call(SIGNAL_POWER.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, SIGNAL_POWER.formatter.replace(/(\{value\})/g, v), v !== 0])
            )
        return null;
    }
    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 学习状态
 */
export class SIGNAL_LEARN extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = ["未学习", "学习中", "已学习"];
   
    valueOf() {
        if(SIGNAL_LEARN.formatter instanceof Array)
            return SIGNAL_LEARN.formatter[this.perform_value];

        if(Object.prototype.toString.call(SIGNAL_LEARN.formatter) == "[object String]")
            return SIGNAL_LEARN.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 水浸状态
 */
export class WATER_STATUS extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = ["未进水", "进水"];

    valueOf() {
        if(WATER_STATUS.formatter instanceof Array)
            return WATER_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(WATER_STATUS.formatter) == "[object String]")
            return WATER_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
}

/**
 * 输出电源模式
 */
export class OUTPUT_POWER_MODE extends CapabilityBasic {
    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }

    static formatter = ["手动模式", "自动模式"];
    
    get perform_value() {
        let perform_value = this.$perform_value.replace(/\[/g, "[\"").replace(/\]/g, "\"]").replace(/(?!\])\,(?!\[)/g, "\",\"");
        return JSON.parse(perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(OUTPUT_POWER_MODE.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, OUTPUT_POWER_MODE.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(OUTPUT_POWER_MODE.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, OUTPUT_POWER_MODE.formatter.replace(/(\{value\})/g, v), v === 1])
            )
        return null;
    }

    
    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
}

/**
 * 输出电源名称
 */

 export class PER_OUTPUT_POWER_NAME extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description);
    }
    
    static formatter = "{value}";

    get perform_value() {
        let perform_value = this.$perform_value.replace(/\[/g, "[\"").replace(/\]/g, "\"]").replace(/(?!\])\,(?!\[)/g, "\",\"");
        return JSON.parse(perform_value.replace(/^(\s?\{\s?)/g,'[').replace(/(\s?\}\s?)$/g, ']'));
    }

    valueOf() {
        if(PER_OUTPUT_POWER_NAME.formatter instanceof Array)
            return this.map(
                ([n, v]) => ([n, PER_OUTPUT_POWER_NAME.formatter[v], v === 1])
            )
        else if(Object.prototype.toString.call(PER_OUTPUT_POWER_NAME.formatter) == "[object String]")
            return this.map(
                ([n, v]) => ([ n, PER_OUTPUT_POWER_NAME.formatter.replace(/(\{value\})/g, v)])
            )
        return null;
    }

    *[Symbol.iterator]() {
        for(let item of this.perform_value) {
            yield item;
        }
    }
 }

 /**
  * 后门状态
  */
 export class PER_BACK_DOOR_STATUS extends CapabilityBasic {

    constructor(id, perform_name, perform_type, data_type, perform_value, perform_description) {
        super(id, perform_name, perform_type, data_type, perform_value, perform_description)
    }

    static formatter = ['关闭', '打开'];

    valueOf() {
        if(PER_BACK_DOOR_STATUS.formatter instanceof Array)
            return PER_BACK_DOOR_STATUS.formatter[this.perform_value];

        if(Object.prototype.toString.call(PER_BACK_DOOR_STATUS.formatter) == "[object String]")
            return PER_BACK_DOOR_STATUS.formatter.replace(/(\{value\})/g, this.perform_value);

        return null;
    }
 }