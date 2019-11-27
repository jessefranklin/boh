<template>
    <div>
        <div v-if="type[0] !== 'ATM'">
            <h4>{{type[0]}} {{text('hours')}}</h4>
            <ul>
                <li v-for="(value, key) in this.operationalHours.hours" :key="key" class="list-hours">
                <div
                    class="cap"
                    v-if="value.hours && value.hours[0].openTime != null || value.isClosed"
                >{{key}}</div>
                <div class="align-right">
                <span v-if="value.isClosed" class="time">{{text('closed')}}</span>
                <span v-if="!value.isClosed">
                    <span v-for="(val, index) in value.hours" :key="index" class="time">
                    <span v-if="val.openTime == null">{{text('closed')}}</span>
                    {{timeFormat(val.openTime)}} - {{timeFormat(val.closeTime)}}
                    </span>
                </span>
                </div>
                </li>
            </ul>
        </div>

        <div v-if="type[0] === 'Branch' && operationalHours.open24Hours == true">
            <h4>{{text('atmhours')}}</h4>
            <ul>
                <li>{{text('atm24hours')}}</li>
            </ul>
        </div>
        <div v-if="meta.specialty.length || meta.branch.length">
            <h4>{{text('branchservices')}}</h4>
            <ul>
                <li v-for="item in meta.specialty" :key="item">{{item}}</li>
                <li v-for="item in meta.branch" :key="item">{{item}}</li>
            </ul>
        </div>
        <div v-if="meta.atm.length">
            <h4>{{text('atmservices')}}</h4>
            <ul>
                <template v-for="item in meta.atm">
                <li v-if="exclude(item)" v-bind:key="item">{{item}}</li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { exclude } from "../../config";
import { locText } from "../mixin/useText";

export default {
    props: {
        type: Array,
        operationalHours: Object,
        meta: Object
    },
    mixins: [locText],
    computed: {
        thisWeek(){
            const thisWeek = this.operationalHours.hours;
            if(!this.operationalHours.exceptions.length) return thisWeek;

            return thisWeek;
        }
    },
    methods: {
        timeFormat(time) {
            return moment(time, ["HH:mm:ss"]).format("h:mm A");
        },
        exclude(item) {
            return exclude.atm.indexOf(item) == -1;
        }
    },
    mounted() {
    }
};
</script>
