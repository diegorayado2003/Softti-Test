<template>
  <div class="tip-payment">
    <header>
      <h1>Pago de Propinas</h1>
    </header>

    <div class="content">
      <div class="left-section">
        <div class="total-tips">
          <label>Total de Propinas</label>
          <div class="amount">
            <input type="number" v-model="totalAmount" min="0" @focus="activeField = 'totalAmount'" />
          </div>
        </div>

        <div class="split-tips">
          <label>¿Entre cuántos quieres dividir las Propinas?</label>
          <input type="number" v-model="employees" min="1" @focus="activeField = 'employees'" />
          <div class="per-person">{{ perPersonAmount }}</div>
        </div>

        <div class="payment-method">
          <label>Elige el Método de Pago</label>
          <div class="methods">
            <button :class="{ selected: selectedMethod === 'cash' }" @click="selectMethod('cash')">Efectivo</button>
            <button :class="{ selected: selectedMethod === 'card' }" @click="selectMethod('card')">BBVA 1234</button>
            <button :class="{ selected: selectedMethod === 'other' }" @click="selectMethod('other')">Santander 1234</button>
          </div>
        </div>
      
        <div class="keypad">
          <div class="keys">
            <button v-for="key in keys" :key="key" @click="addDigit(key)">{{ key }}</button>
          </div>
        </div>
      

        <div class="payments">
          <div class="payment" v-for="payment in payments" :key="payment.method">
            <span>{{ payment.method }}</span>
            <span>{{ payment.amount }}</span>
            <button @click="removePayment(payment.method)">X</button>
          </div>
        </div>

        <button @click="confirmPayment">Confirmar Pago</button>

        <div v-if="message" :class="{'success': success, 'error': !success}">
          {{ message }}
        </div>
      </div>

      <div class="right-section">
        <h2>Recibos</h2>
        <div v-for="receipt in receipts.slice(-5).reverse()" :key="receipt.id" class="receipt">
          <pre>{{ receipt.content }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const employees = ref(5)
const totalAmount = ref(1500)
const payments = ref<{ method: string, amount: number }[]>([])
const message = ref('')
const success = ref(false)
const selectedMethod = ref('')
const receipts = ref<{ id: number, content: string }[]>([])
const activeField = ref<'totalAmount' | 'employees'>('totalAmount')

const perPersonAmount = computed(() => {
  return `$${(totalAmount.value / employees.value).toFixed(2)} por Persona`
})

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '00', 0]

const addDigit = (digit: number | string) => {
  if (activeField.value === 'totalAmount') {
    totalAmount.value = parseInt(`${totalAmount.value}${digit}`)
  } else if (activeField.value === 'employees') {
    employees.value = parseInt(`${employees.value}${digit}`)
  }
}

const selectMethod = (method: string) => {
  selectedMethod.value = method
}

const removePayment = (method: string) => {
  payments.value = payments.value.filter(payment => payment.method !== method)
}

const getTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:5000/tips/transactions')
    receipts.value = response.data.transactions.map((transaction: any) => ({
      id: transaction._id,
      content: transaction.receipt
    }))
  } catch (error) {
    console.error('Error al obtener las transacciones:', error)
  }
}

const confirmPayment = async () => {
  try {
    console.log('Enviando datos:', {
      totalAmount: totalAmount.value,
      employees: employees.value,
      paymentMethod: selectedMethod.value || 'cash'
    });

    const response = await axios.post('http://localhost:5000/tips/split', {
      totalAmount: totalAmount.value,
      employees: employees.value,
      paymentMethod: selectedMethod.value || 'cash'
    })
    message.value = 'Propinas divididas y guardadas en la BD'
    success.value = true
    console.log(response.data)

    // Actualizar la lista de recibos
    await getTransactions()
  } catch (error) {
    message.value = `Error al confirmar el pago: ${(error as any).response?.data?.message || (error as any).message}`
    success.value = false
    console.error('Error al confirmar el pago:', error)
  }
}

// Obtener las transacciones al montar el componente
onMounted(() => {
  getTransactions()
})
</script>

<style scoped>
.tip-payment {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.content {
  display: flex;
  gap: 2rem;
}

.left-section {
  flex: 1;
}

.right-section {
  flex: 1;
  max-width: 400px;
}

.total-tips, .split-tips, .payment-method, .keypad, .payments {
  margin-bottom: 1rem;
}

.amount {
  font-size: 2rem;
  color: #ff6b6b;
}

.per-person {
  font-size: 1.5rem;
  color: #ff6b6b;
}

.methods button {
  margin-right: 1rem;
  padding: 1rem;
  font-size: 1rem;
  background-color: #ff6b6b;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 8px;
}

.methods button.selected {
  background-color: #7a0707;
  color: white;
}

.keys {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.keys button {
  padding: 1rem;
  font-size: 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.keys button:hover {
  background-color: #ff4b4b;
}

.payments {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.payment {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 1rem;
  font-size: 1rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  border-radius: 8px;
}

button:hover {
  background-color: #ff4b4b;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}

.receipt {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}
</style>