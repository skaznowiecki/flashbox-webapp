<template>
    <v-card>
        <v-card-title>
            <span class="text-h6">Retención Fiscal</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12" v-if="payroll.taxWithholding">
                        <v-alert type="info" variant="tonal" class="mb-4">
                            Ya existe un archivo de retención fiscal adjunto
                        </v-alert>
                        <v-btn color="primary" variant="outlined" @click="openCurrentRetention" class="mb-4" block>
                            Abrir Retención Fiscal Actual
                        </v-btn>
                    </v-col>

                    <v-col cols="12">
                        <v-file-input v-model="selectedFile" label="Seleccionar archivo de retención fiscal"
                            variant="outlined" accept=".pdf,.jpg,.jpeg,.png" prepend-icon="mdi-paperclip"
                            :rules="fileValidation" show-size></v-file-input>
                    </v-col>

                    <v-col cols="12" v-if="selectedFile && selectedFile.length > 0">
                        <v-alert type="success" variant="tonal">
                            Archivo seleccionado: {{ selectedFile[0]?.name }}
                        </v-alert>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" @click="submit" :loading="loading"
                :disabled="!selectedFile || selectedFile.length === 0">
                {{ payroll.taxWithholding ? 'Reemplazar Archivo' : 'Adjuntar Archivo' }}
            </v-btn>
            <v-btn variant="outlined" @click="emitter('close')">
                Cerrar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from 'vue'

const emitter = defineEmits(['close', 'submit'])

const props = defineProps({
    payroll: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const selectedFile = ref([])

const fileValidation = [
    (value) => {
        if (!value || value.length === 0) return true
        const file = value[0]
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            return 'El archivo no puede ser mayor a 10MB'
        }
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        if (!allowedTypes.includes(file.type)) {
            return 'Solo se permiten archivos PDF, JPG, JPEG o PNG'
        }
        return true
    }
]

const submit = () => {
    if (selectedFile.value && selectedFile.value.length > 0) {
        emitter('submit', {
            file: selectedFile.value[0],
            payrollId: props.payroll.id
        })
    }
}

const openCurrentRetention = () => {
    if (props.payroll.taxWithholding) {
        const cdnBaseUrl = import.meta.env.VITE_CDN_BASE_URL
        const fullUrl = `${cdnBaseUrl}/${props.payroll.taxWithholding.bucketKey}`
        window.open(fullUrl, '_blank')
    }
}
</script>