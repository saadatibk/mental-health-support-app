import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';
import { Resource } from '../models/types';

interface TherapyResourcesProps {
  resources: Resource[];
  title?: string;
  showCategoryFilter?: boolean;
}

const TherapyResources: React.FC<TherapyResourcesProps> = ({ 
  resources,
  title = "Helpful Resources",
  showCategoryFilter = false
}) => {
  const { colors, spacing, borderRadius, fontSizes, isDark } = useTheme();
  const [expandedResourceId, setExpandedResourceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  
  const categories = [
    { id: 'crisis', label: 'Crisis Support', icon: 'alert-circle' },
    { id: 'articles', label: 'Articles', icon: 'document-text' },
    { id: 'exercises', label: 'Exercises', icon: 'fitness' },
    { id: 'community', label: 'Community', icon: 'people' }
  ];
  
  // Filter resources based on active category
  const filteredResources = activeCategory 
    ? resources.filter(resource => resource.category === activeCategory)
    : resources;
  
  const toggleExpandResource = (id: string) => {
    setExpandedResourceId(expandedResourceId === id ? null : id);
  };
  
  const openUrl = async (url?: string, resourceId?: string) => {
    if (!url) return;
    
    try {
      setIsLoading(resourceId || null);
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Can't Open Link",
          "This link can't be opened on your device.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "There was a problem opening this resource.",
        [{ text: "OK" }]
      );
      console.error("Error opening URL:", error);
    } finally {
      setIsLoading(null);
    }
  };
  
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'crisis': return 'alert-circle';
      case 'articles': return 'document-text';
      case 'exercises': return 'fitness';
      case 'community': return 'people';
      default: return 'help-circle';
    }
  };
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'crisis': return colors.error;
      case 'articles': return colors.info;
      case 'exercises': return colors.success;
      case 'community': return colors.primary;
      default: return colors.textSecondary;
    }
  };
  
  const handleCategoryChange = (categoryId: string | null) => {
    // Animate fade out
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Set new category
      setActiveCategory(categoryId === activeCategory ? null : categoryId);
      
      // Animate fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };
  
  const renderResourceCard = (resource: Resource) => {
    const isExpanded = expandedResourceId === resource.id;
    const isLoading = isLoading === resource.id;
    const categoryColor = getCategoryColor(resource.category);
    
    return (
      <View 
        key={resource.id}
        style={[
          styles.resourceCard,
          { 
            backgroundColor: colors.cardBackground,
            borderRadius: borderRadius.md,
            borderLeftWidth: 4,
            borderLeftColor: categoryColor,
            marginBottom: spacing.md,
            // Add shadow for light mode only to avoid too much contrast in dark mode
            ...(!isDark ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2
            } : {})
          }
        ]}
      >
        <TouchableOpacity
          style={styles.resourceHeader}
          onPress={() => toggleExpandResource(resource.id)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`${resource.title}, ${resource.category} resource. Tap to ${isExpanded ? 'collapse' : 'expand'}`}
          accessibilityHint={isExpanded ? "Collapses this resource" : "Shows more details about this resource"}
        >
          <View style={styles.resourceIconContainer}>
            <View 
              style={[
                styles.iconCircle,
                { 
                  backgroundColor: categoryColor + '20',
                }
              ]}
            >
              <Ionicons 
                name={getCategoryIcon(resource.category) as any} 
                size={20} 
                color={categoryColor} 
              />
            </View>
          </View>
          
          <View style={styles.resourceTitleContainer}>
            <Text 
              style={[
                styles.resourceTitle,
                { color: colors.text, fontSize: fontSizes.md }
              ]}
              numberOfLines={isExpanded ? undefined : 1}
            >
              {resource.title}
            </Text>
            
            {!isExpanded && (
              <Text 
                style={[
                  styles.resourceDescription,
                  { color: colors.textSecondary, fontSize: fontSizes.sm }
                ]}
                numberOfLines={1}
              >
                {resource.description}
              </Text>
            )}
          </View>
          
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={[styles.expandedContent, { paddingHorizontal: spacing.md }]}>
            <Text 
              style={[
                styles.expandedDescription,
                { color: colors.text, marginBottom: spacing.md }
              ]}
            >
              {resource.description}
            </Text>
            
            <View style={styles.tagsContainer}>
              {resource.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { 
                      backgroundColor: categoryColor + '15',
                      borderRadius: borderRadius.sm,
                      marginRight: spacing.sm,
                      marginBottom: spacing.sm
                    }
                  ]}
                >
                  <Text style={[
                    styles.tagText,
                    { color: categoryColor, fontSize: fontSizes.xs }
                  ]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
            
            {resource.url && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { 
                    backgroundColor: categoryColor,
                    borderRadius: borderRadius.md,
                    marginTop: spacing.md,
                    marginBottom: spacing.sm,
                    opacity: isLoading ? 0.7 : 1
                  }
                ]}
                onPress={() => openUrl(resource.url, resource.id)}
                disabled={isLoading}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel={`Access ${resource.title}`}
                accessibilityHint="Opens this resource in your browser or app"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="open-outline" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>
                      {resource.category === 'crisis' ? 'Get Help Now' : 'Access Resource'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { marginBottom: spacing.lg }]}>
      <View style={[styles.headerContainer, { marginBottom: spacing.md }]}>
        <Text style={[
          styles.title,
          { color: colors.text, fontSize: fontSizes.lg, fontWeight: '600' }
        ]}>
          {title}
        </Text>
        
        {resources.length > 0 && (
          <Text style={[
            styles.resourceCount,
            { color: colors.textSecondary }
          ]}>
            {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
          </Text>
        )}
      </View>
      
      {showCategoryFilter && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.filtersContainer,
            { marginBottom: spacing.md }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              { 
                backgroundColor: activeCategory === null ? colors.primary : colors.cardBackground,
                borderRadius: borderRadius.lg,
                marginRight: spacing.sm
              }
            ]}
            onPress={() => handleCategoryChange(null)}
          >
            <Text style={{ 
              color: activeCategory === null ? '#FFFFFF' : colors.text,
              fontWeight: activeCategory === null ? '600' : 'normal'
            }}>
              All
            </Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterChip,
                { 
                  backgroundColor: activeCategory === category.id 
                    ? getCategoryColor(category.id) 
                    : colors.cardBackground,
                  borderRadius: borderRadius.lg,
                  marginRight: spacing.sm
                }
              ]}
              onPress={() => handleCategoryChange(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={activeCategory === category.id ? '#FFFFFF' : getCategoryColor(category.id)} 
                style={{ marginRight: 6 }}
              />
              <Text style={{ 
                color: activeCategory === category.id ? '#FFFFFF' : colors.text,
                fontWeight: activeCategory === category.id ? '600' : 'normal'
              }}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <Animated.View style={{ opacity: fadeAnim }}>
        {filteredResources.length > 0 ? (
          filteredResources.map(renderResourceCard)
        ) : (
          <View style={[styles.emptyContainer, { padding: spacing.lg }]}>
            <Ionicons 
              name="search" 
              size={32} 
              color={colors.textSecondary} 
              style={{ marginBottom: spacing.md }}
            />
            <Text style={[
              styles.emptyText,
              { color: colors.textSecondary, textAlign: 'center' }
            ]}>
              No resources found in this category.
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    marginBottom: 4,
  },
  resourceCount: {
    fontSize: 12,
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  resourceCard: {
    overflow: 'hidden',
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  resourceIconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  resourceTitle: {
    fontWeight: '500',
  },
  resourceDescription: {
    marginTop: 2,
  },
  expandedContent: {
    paddingBottom: 16,
  },
  expandedDescription: {
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    maxWidth: 240,
  }
});

export default TherapyResources;