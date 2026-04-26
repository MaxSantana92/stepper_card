import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Badge } from '../../../components/ui/Badge';
import { Body, Heading, Subtitle } from '../../../components/ui/Typography';
import { colors, elevation, radii, spacing } from '../../../components/ui/theme';
import type { CardStatusKind, FinancialCard } from '../types';

interface StatusCardProps {
  card: FinancialCard;
  style?: ViewStyle;
}

const ACCENT_BY_STATUS: Record<CardStatusKind, string> = {
  enabled: colors.success,
  disabled: colors.danger,
  paused: colors.warning,
  unpaused: colors.info,
};

const formatBalance = (value: number, locale: string): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$ ${value.toFixed(2)}`;
  }
};

export const StatusCard = ({ card, style }: StatusCardProps) => {
  const { t, i18n } = useTranslation();

  const accent = ACCENT_BY_STATUS[card.status.kind];
  const statusLabel = t(`card.statuses.${card.status.kind}`);
  const typeLabel = t(`card.types.${card.type}`);

  const containerStyle: ViewStyle = {
    ...styles.container,
    borderLeftColor: accent,
    ...(style ?? {}),
  };

  const summary = t('a11y.card.summary', {
    type: typeLabel,
    lastFour: card.lastFour,
    status: statusLabel,
  });

  const formattedBalance = formatBalance(card.balance, i18n.language);

  return (
    <View
      accessibilityLabel={summary}
      accessibilityRole="summary"
      accessible
      style={containerStyle}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Subtitle style={styles.typeLabel}>{typeLabel}</Subtitle>
          <Body color={colors.textMuted} style={styles.lastFour}>
            {`${t('card.labels.lastFour')} ${card.lastFour}`}
          </Body>
        </View>
        <Badge
          accessibilityLabel={t('a11y.card.statusBadgeHint')}
          label={statusLabel}
          status={card.status.kind}
        />
      </View>

      <View style={styles.balanceRow}>
        <Body color={colors.textMuted}>{t('card.labels.balance')}</Body>
        <Heading
          accessibilityLabel={t('a11y.card.balanceHint')}
          accessibilityRole="text"
          style={styles.balanceValue}
        >
          {formattedBalance}
        </Heading>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Body color={colors.textMuted} style={styles.metaLabel}>
            {t('card.labels.holderName')}
          </Body>
          <Body color={colors.textPrimary} style={styles.metaValue}>
            {card.holderName}
          </Body>
        </View>
        <View style={styles.metaItem}>
          <Body color={colors.textMuted} style={styles.metaLabel}>
            {t('card.labels.expiryDate')}
          </Body>
          <Body color={colors.textPrimary} style={styles.metaValue}>
            {card.expiryDate}
          </Body>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    ...elevation.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerLeft: {
    flexShrink: 1,
  },
  typeLabel: {
    color: colors.textPrimary,
  },
  lastFour: {
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
  balanceRow: {
    gap: spacing.xs,
  },
  balanceValue: {
    color: colors.textPrimary,
    fontSize: 26,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  metaItem: {
    flex: 1,
    gap: spacing.xs,
  },
  metaLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});
