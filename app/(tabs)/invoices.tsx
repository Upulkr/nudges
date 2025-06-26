import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Search, Filter, Plus, Eye, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { YStack, XStack, Text, Input, Button, Card, H1, H3 } from 'tamagui';
import { Storage } from '@/utils/storage';
import { Invoice } from '@/types/invoice';
import { TourTooltip } from '@/components/TourTooltip';
import { PulseWrapper } from '@/components/PulseWrapper';
import { useTourStore } from '@/store/tourStore';
import { invoicesTourSteps } from '@/utils/tourSteps';

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const { startTour } = useTourStore();

  useEffect(() => {
    loadInvoices();
    // Start tour automatically for first-time users
    const timer = setTimeout(() => {
      startTour(invoicesTourSteps);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, selectedFilter]);

  const loadInvoices = async () => {
    const data = await Storage.getInvoices();
    setInvoices(data);
  };

  const filterInvoices = () => {
    let filtered = invoices;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInvoices();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return { backgroundColor: '$green2', color: '$green11' };
      case 'sent': return { backgroundColor: '$blue2', color: '$blue11' };
      case 'overdue': return { backgroundColor: '$red2', color: '$red11' };
      case 'draft': return { backgroundColor: '$gray3', color: '$gray11' };
      default: return { backgroundColor: '$gray3', color: '$gray11' };
    }
  };

  const FilterButton = ({ status, label, isActive }: { status: string; label: string; isActive: boolean }) => (
    <Button
      size="$2"
      backgroundColor={isActive ? '$blue9' : '$background'}
      borderColor={isActive ? '$blue9' : '$gray6'}
      borderWidth={1}
      onPress={() => setSelectedFilter(status)}
    >
      <Text
        fontSize={14}
        fontWeight="500"
        color={isActive ? 'white' : '$gray11'}
      >
        {label}
      </Text>
    </Button>
  );

  const renderInvoice = ({ item }: { item: Invoice }) => {
    const statusStyle = getStatusColor(item.status);
    
    return (
      <Card
        backgroundColor="$background"
        borderRadius="$4"
        padding="$5"
        marginBottom="$4"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.05}
        shadowRadius={4}
        elevation={2}
        borderWidth={1}
        borderColor="$gray3"
      >
        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
          <YStack flex={1}>
            <Text fontSize={18} fontWeight="600" color="$gray12" marginBottom="$1">
              {item.invoiceNumber}
            </Text>
            <Text fontSize={14} color="$gray10">
              {item.customer.name}
            </Text>
          </YStack>
          <YStack
            backgroundColor={statusStyle.backgroundColor}
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius="$5"
          >
            <Text fontSize={12} fontWeight="600" color={statusStyle.color}>
              {item.status.toUpperCase()}
            </Text>
          </YStack>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
          <Text fontSize={24} fontWeight="700" color="$green10">
            ${item.total.toLocaleString()}
          </Text>
          <Text fontSize={14} color="$gray10">
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        </XStack>

        <XStack 
          justifyContent="space-between" 
          alignItems="center" 
          paddingTop="$3" 
          borderTopWidth={1} 
          borderTopColor="$gray3"
        >
          <Text fontSize={14} color="$gray10" flex={1}>
            {item.customer.email}
          </Text>
          <XStack gap="$2">
            <TouchableOpacity>
              <YStack padding="$2" backgroundColor="$gray1" borderRadius="$2">
                <Eye size={16} color="$gray10" />
              </YStack>
            </TouchableOpacity>
            <TouchableOpacity>
              <YStack padding="$2" backgroundColor="$blue2" borderRadius="$2">
                <Edit size={16} color="$blue9" />
              </YStack>
            </TouchableOpacity>
            <TouchableOpacity>
              <YStack padding="$2" backgroundColor="$red2" borderRadius="$2">
                <Trash2 size={16} color="$red9" />
              </YStack>
            </TouchableOpacity>
          </XStack>
        </XStack>
      </Card>
    );
  };

  return (
    <YStack flex={1} backgroundColor="$gray1">
      {/* Header */}
      <YStack
        backgroundColor="$background"
        paddingTop={56}
        paddingHorizontal="$4"
        paddingBottom="$4"
        borderBottomWidth={1}
        borderBottomColor="$gray5"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <H1 fontSize={32} fontWeight="700" color="$gray12">
            Invoices
          </H1>
          <PulseWrapper elementId="add-invoice-btn">
            <Button
              size="$4"
              circular
              backgroundColor="$blue9"
              onPress={() => router.push('/(tabs)/create')}
              shadowColor="$blue9"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              elevation={4}
            >
              <Plus size={24} color="white" />
            </Button>
          </PulseWrapper>
        </XStack>
      </YStack>

      {/* Search Bar */}
      <XStack paddingHorizontal="$4" paddingTop="$4" gap="$3">
        <PulseWrapper elementId="search-bar">
          <XStack
            flex={1}
            alignItems="center"
            backgroundColor="$background"
            borderRadius="$3"
            paddingHorizontal="$4"
            paddingVertical="$3"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 1 }}
            shadowOpacity={0.05}
            shadowRadius={2}
            elevation={1}
            borderWidth={1}
            borderColor="$gray5"
          >
            <Search size={20} color="$gray10" />
            <Input
              flex={1}
              marginLeft="$3"
              fontSize={16}
              color="$gray12"
              placeholder="Search invoices..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              backgroundColor="transparent"
              borderWidth={0}
            />
          </XStack>
        </PulseWrapper>
        <Button
          size="$4"
          backgroundColor="$background"
          borderRadius="$3"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.05}
          shadowRadius={2}
          elevation={1}
          borderWidth={1}
          borderColor="$gray5"
        >
          <Filter size={20} color="$gray10" />
        </Button>
      </XStack>

      {/* Filter Buttons */}
      <PulseWrapper elementId="filter-buttons">
        <XStack paddingHorizontal="$4" paddingTop="$4" gap="$2">
          <FilterButton status="all" label="All" isActive={selectedFilter === 'all'} />
          <FilterButton status="draft" label="Draft" isActive={selectedFilter === 'draft'} />
          <FilterButton status="sent" label="Sent" isActive={selectedFilter === 'sent'} />
          <FilterButton status="paid" label="Paid" isActive={selectedFilter === 'paid'} />
          <FilterButton status="overdue" label="Overdue" isActive={selectedFilter === 'overdue'} />
        </XStack>
      </PulseWrapper>

      {/* Invoice List */}
      <PulseWrapper elementId="invoice-list">
        <YStack flex={1}>
          <FlatList
            data={filteredInvoices}
            renderItem={renderInvoice}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        </YStack>
      </PulseWrapper>

      <TourTooltip />
    </YStack>
  );
}