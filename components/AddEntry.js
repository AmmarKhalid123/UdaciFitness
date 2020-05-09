import React, { Component } from 'react';
import { View , Text, TouchableOpacity } from 'react-native';
import { getMetricMetaInfo, timeToString} from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciStepper from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api'

function SubmitBtn ({onPress}) {
    return (
        <TouchableOpacity
        onPress={onPress} >
            <Text>Submit</Text>
        </TouchableOpacity>
    )
}


export default class AddEntry extends Component {
    state = {
        run: 0,
        eat: 0,
        sleep: 0,
        bike: 0,
        swim: 0
    }
    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)

        this.setState((state) => {
            const count = state[metric] + step

            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }

    
    decrement = (metric) => {

        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step

            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slide = (metric, val) => {
        this.setState(() => ({
            [metric]: val
        }))
    }

    submit = () => {
        const key = timeToString()
        const entry = this.state

        // update redux
        this.setState(() => ({
            run: 0,
            eat: 0,
            sleep: 0,
            bike: 0,
            swim: 0
        }))


        // nav to home
        submitEntry({key, entry})
        // clear the local notif
    }
    reset = () => {
        const key = timeToString()

        //upd to redux

        removeEntry(key)

        //route to home
    }

    render() {

        const metaInfo = getMetricMetaInfo()

        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons
                    name='md-happy'
                    size={100}
                    />
                    <Text>You already have logged your information for today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        return (
            <View>
                <DateHeader date={new Date().toLocaleDateString()} />
                {Object.keys(metaInfo).map((key) => {
                    const { getIcon, type, ...rest} = metaInfo[key]
                    const value = this.state[key]
                    return(
                        <View key={key}>
                            {getIcon()}
                            {type==='slider'
                            ? <UdaciSlider value={value}
                                onChange={(value) => this.slide(key, value)}
                                {...rest} /> 
                            : <UdaciStepper
                                value={value}
                                onIncrement={() => this.increment(key)}
                                onDecrement={() => this.decrement(key)} 
                                {...rest} />
                            }
                        </View>
                     
                    )
                })}
                <SubmitBtn onPress={this.submit} />
            </View>
        )
    }
    
}