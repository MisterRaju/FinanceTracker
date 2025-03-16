import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Transaction = {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
};

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

function App(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState(categories[0]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const saveTransactions = async (data: Transaction[]) => {
    await AsyncStorage.setItem('transactions', JSON.stringify(data));
  };

  const loadTransactions = async () => {
    const storedTransactions = await AsyncStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  };

  const addOrUpdateTransaction = () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please enter a valid amount and description.');
      return;
    }

    if (editId !== null) {
      // Update existing transaction
      const updatedTransactions = transactions.map((t) =>
        t.id === editId ? { ...t, amount: parseFloat(amount), description, category, type } : t
      );
      setTransactions(updatedTransactions);
      saveTransactions(updatedTransactions);
      setEditId(null);
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        id: Date.now(),
        type,
        amount: parseFloat(amount),
        description,
        category,
      };
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      saveTransactions(updatedTransactions);
    }

    setAmount('');
    setDescription('');
  };

  const deleteTransaction = (id: number) => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          const updatedTransactions = transactions.filter((t) => t.id !== id);
          setTransactions(updatedTransactions);
          saveTransactions(updatedTransactions);
        },
      },
    ]);
  };

  const editTransaction = (transaction: Transaction) => {
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setType(transaction.type);
    setCategory(transaction.category);
    setEditId(transaction.id);
  };

  const balance = transactions.reduce(
    (acc, transaction) =>
      transaction.type === 'income'
        ? acc + transaction.amount
        : acc - transaction.amount,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 Finance Tracker</Text>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
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

      {/* Category Selector */}
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryButton, category === item && styles.activeCategory]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, category === item && styles.activeCategoryText]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Add/Update Button */}
      <TouchableOpacity style={styles.addButton} onPress={addOrUpdateTransaction}>
        <Text style={styles.addButtonText}>{editId !== null ? 'Update' : '+ Add'} Transaction</Text>
      </TouchableOpacity>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.transactionCard}
            onPress={() => editTransaction(item)}
            onLongPress={() => deleteTransaction(item.id)}
          >
            <View>
              <Text style={styles.transactionText}>{item.description} ({item.category})</Text>
              <Text style={styles.transactionAmount}>
                {item.type === 'income' ? '+ ' : '- '}
                ${item.amount.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.deleteText}>Tap to Edit | Long Press to Delete</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// 🌟 Beautiful Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  balanceCard: { backgroundColor: '#00796B', padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 20, elevation: 5 },
  balanceTitle: { fontSize: 16, color: '#fff' },
  balanceAmount: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 5 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  toggleButton: { flex: 1, padding: 12, backgroundColor: '#e0e0e0', borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  activeButton: { backgroundColor: '#00796B' },
  categoryButton: { padding: 10, margin: 5, borderRadius: 5, backgroundColor: '#ddd',height:50 },
  activeCategory: { backgroundColor: '#00796B' },
  categoryText: { fontSize: 14 },
  activeCategoryText: { color: '#fff' },
  addButton: { backgroundColor: '#00796B', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default App;
