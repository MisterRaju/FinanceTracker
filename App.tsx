import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

type Transaction = {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
};

function App(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  const balance = transactions.reduce(
    (acc, transaction) =>
      transaction.type === 'income'
        ? acc + transaction.amount
        : acc - transaction.amount,
    0
  );

  const addTransaction = () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please enter a valid amount and description.');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      description,
    };

    setTransactions([...transactions, newTransaction]);
    setAmount('');
    setDescription('');
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 Finance Tracker</Text>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          ${balance.toFixed(2)}
        </Text>
      </View>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Income & Expense Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, type === 'income' && styles.activeButton]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.toggleText, type === 'income' && styles.activeText]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, type === 'expense' && styles.activeButton]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.toggleText, type === 'expense' && styles.activeText]}>Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={addTransaction}>
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View>
              <Text style={styles.transactionText}>{item.description}</Text>
              <Text style={styles.transactionAmount}>
                {item.type === 'income' ? '+ ' : '- '}
                ${item.amount.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// 🌟 Beautiful Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#00796B',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#fff',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#00796B',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#00796B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796B',
    marginTop: 3,
  },
});

export default App;
