import {Component, Prop} from 'vue-property-decorator'
import * as Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import Contributors from './contributors'
import Upload, {UploadPage} from './upload'
import CodebaseReleaseMetadata from './detail'
import CodebaseEditForm from '../edit'
import {store} from './store'
import {CreateOrUpdateHandler} from "api/handler";
import {CodebaseReleaseAPI} from "api";
import * as _ from 'lodash';

const codebaseReleaseAPI = new CodebaseReleaseAPI();

Vue.use(Vuex);
Vue.use(VueRouter);

@Component({
    template: `<div class="modal fade" id="editCodebaseModal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Codebase</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <codebase-edit-form :_identifier="identifier" :redirect="redirect"></codebase-edit-form>
                    </div>
                </div>
            </div>
        </div>`,
    components: {
        'codebase-edit-form': CodebaseEditForm
    }
})
class CodebaseEditFormPopup extends Vue {
    @Prop()
    identifier: string;

    @Prop()
    redirect: boolean;
}

@Component({
    template: `<div class="modal fade" id="publishCodebaseReleaseModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Publish Codebase Release {{ version_number }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>
                        Publishing a codebase result release makes possible for anyone to view and download it. 
                        Published releases must have code and documentation files and at least one contributor. Once a
                        release is published files associated with the release cannot be added, modified or deleted.
                    </p>
                    <p>
                        Publishing a release cannot be undone. Do you want to continue?
                    </p>
                </div>
                <div class="alert alert-danger" v-for="error in errorMessages">{{ error }}</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="publish">Publish</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>`
})
class PublishModal extends Vue implements CreateOrUpdateHandler {
    @Prop()
    identifier: string;

    @Prop()
    version_number: number;

    @Prop()
    absolute_url: string;

    errorMessages: Array<string> = [];

    clear() {
        this.errorMessages = [];
    }

    handleOtherError(response_or_network_error) {
        this.errorMessages = ['Network error'];
    }

    handleServerValidationError(responseError) {
        const response = responseError.response;
        _.forEach(response.data, msg => this.errorMessages.push(msg));
    }

    handleSuccessWithoutDataResponse(response) {
        window.location.pathname = this.absolute_url;
    }

    handleSuccessWithDataResponse(response) {
        window.location.pathname = this.absolute_url;
    }

    publish() {
        this.clear();
        return codebaseReleaseAPI.publish({identifier: this.identifier, version_number: this.version_number}, this);
    }
}

@Component(<any>{
    store: new Vuex.Store(store),
    components: {
        'c-publish-modal': PublishModal,
        'c-codebase-edit-form-popup': CodebaseEditFormPopup,
    },
    template: `<div>
        <div v-if="isInitialized">
            <h1><a :href="absolute_url">{{ $store.state.release.codebase.title }} <i>v{{ $store.state.release.version_number }}</i></a> 
                <span class="fa fa-edit has-pointer-cursor" data-target="#editCodebaseModal" data-toggle="modal"></span>
                <span class="badge badge-secondary" v-if="isPublished">Published</span>
                <span class="badge badge-warning has-pointer-cursor" data-target="#publishCodebaseReleaseModal" data-toggle="modal" v-else>
                    Unpublished
                </span>
            </h1>
            <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item" v-if="!isPublished">
                    <router-link :to="{ name: 'upload'}" class="nav-link required" active-class="disabled">Upload</router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: 'contributors' }" class="nav-link required" active-class="disabled">Contributors</router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: 'detail' }" class="nav-link required" active-class="disabled">
                        Detail<span class="badge badge-pill badge-danger" v-if="detailPageErrors !== 0">{{ detailPageErrors }} errors</span>
                    </router-link>
                </li>
            </ul>
            <router-view :initialData="initialData"></router-view>
            <c-codebase-edit-form-popup :identifier="identifier" :redirect="false"></c-codebase-edit-form-popup>
            <c-publish-modal :version_number="version_number" :identifier="identifier" :absolute_url="absolute_url"></c-publish-modal>
        </div>
        <div v-else>
            <h1>Loading codebase release metadata...</h1>
        </div>
    </div>`,
    router: new VueRouter({
        routes: [
            {path: '/', redirect: {name: 'contributors'}},
            {path: '/upload', component: UploadPage, name: 'upload'},
            {path: '/contributors/', component: Contributors, name: 'contributors'},
            {path: '/detail/', component: CodebaseReleaseMetadata, name: 'detail'}
        ]
    })
})
class Workflow extends Vue {
    @Prop()
    identifier: string;

    @Prop()
    version_number: string;

    isInitialized: boolean = false;

    get absolute_url() {
        return this.$store.state.release.absolute_url;
    }

    get isPublished() {
        return this.$store.state.release.live;
    }

    get initialData() {
        switch (this.$route.name) {
            case 'contributors':
                return this.$store.getters.release_contributors;
            case 'detail':
                return this.$store.getters.detail;
            default:
                return {}
        }
    }

    get detailPageErrors() {
        return 0;
    }

    created() {
        if (this.identifier && this.version_number) {
            this.$store.dispatch('initialize', {
                identifier: this.identifier,
                version_number: this.version_number
            }).then(response => this.isInitialized = true);
        } else {
            this.isInitialized = true;
        }
    }
}

export default Workflow;