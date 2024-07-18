import React, {useCallback} from 'react';
import {View} from 'react-native';
import Badge from '@components/Badge';
import Button from '@components/Button';
import * as Expensicons from '@components/Icon/Expensicons';
import {useSearchContext} from '@components/Search/SearchContext';
import useLocalize from '@hooks/useLocalize';
import useStyleUtils from '@hooks/useStyleUtils';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import variables from '@styles/variables';
import * as SearchActions from '@userActions/Search';
import CONST from '@src/CONST';
import type {TranslationPaths} from '@src/languages/types';
import type {SearchTransactionAction} from '@src/types/onyx/SearchResults';

const actionTranslationsMap: Record<SearchTransactionAction, TranslationPaths> = {
    view: 'common.view',
    review: 'common.review',
    submit: 'common.submit',
    approve: 'iou.approve',
    pay: 'iou.pay',
    done: 'common.done',
    paid: 'iou.settledExpensify',
};

type ActionCellProps = {
    action?: SearchTransactionAction;
    reportID?: string;
    isLargeScreenWidth?: boolean;
    isSelected?: boolean;
    goToItem: () => void;
    isChildListItem?: boolean;
    parentAction?: string;
};

function ActionCell({
    action = CONST.SEARCH.ACTION_TYPES.VIEW,
    reportID,
    isLargeScreenWidth = true,
    isSelected = false,
    goToItem,
    isChildListItem = false,
    parentAction = '',
}: ActionCellProps) {
    const {translate} = useLocalize();
    const theme = useTheme();
    const styles = useThemeStyles();
    const StyleUtils = useStyleUtils();

    const {currentSearchHash} = useSearchContext();

    const onButtonPress = useCallback(() => {
        if (!reportID) {
            return;
        }

        if (action === CONST.SEARCH.ACTION_TYPES.SUBMIT) {
            SearchActions.submitMoneyRequestOnSearch(currentSearchHash, [reportID]);
            return;
        }

        if (action === CONST.SEARCH.ACTION_TYPES.APPROVE) {
            SearchActions.approveMoneyRequestOnSearch(currentSearchHash, [reportID]);
        }
    }, [action, currentSearchHash, reportID]);

    const text = translate(actionTranslationsMap[action]);

    const shouldUseViewAction = action === CONST.SEARCH.ACTION_TYPES.VIEW || (parentAction === CONST.SEARCH.ACTION_TYPES.PAID && action === CONST.SEARCH.ACTION_TYPES.PAID);

    if ((parentAction !== CONST.SEARCH.ACTION_TYPES.PAID && action === CONST.SEARCH.ACTION_TYPES.PAID) || action === CONST.SEARCH.ACTION_TYPES.DONE) {
        return (
            <View style={[StyleUtils.getHeight(variables.h28), styles.justifyContentCenter]}>
                <Badge
                    text={text}
                    icon={Expensicons.Checkmark}
                    badgeStyles={[
                        styles.ml0,
                        styles.ph2,
                        styles.gap1,
                        isLargeScreenWidth ? styles.alignSelfCenter : styles.alignSelfEnd,
                        StyleUtils.getHeight(variables.h20),
                        StyleUtils.getMinimumHeight(variables.h20),
                        isSelected ? StyleUtils.getBorderColorStyle(theme.buttonHoveredBG) : StyleUtils.getBorderColorStyle(theme.border),
                    ]}
                    textStyles={StyleUtils.getFontSizeStyle(variables.fontSizeExtraSmall)}
                    iconStyles={styles.mr0}
                    success
                />
            </View>
        );
    }

    const buttonInnerStyles = isSelected ? styles.buttonDefaultHovered : {};

    if (action === CONST.SEARCH.ACTION_TYPES.VIEW || shouldUseViewAction) {
        return isLargeScreenWidth ? (
            <Button
                text={translate(actionTranslationsMap[CONST.SEARCH.ACTION_TYPES.VIEW])}
                onPress={goToItem}
                small
                pressOnEnter
                style={[styles.w100]}
                innerStyles={buttonInnerStyles}
                link={isChildListItem}
                shouldUseDefaultHover={!isChildListItem}
            />
        ) : null;
    }

    if (action === CONST.SEARCH.ACTION_TYPES.REVIEW) {
        return (
            <Button
                text={text}
                onPress={goToItem}
                small
                pressOnEnter
                style={[styles.w100]}
                innerStyles={buttonInnerStyles}
            />
        );
    }
    return (
        <Button
            text={text}
            onPress={onButtonPress}
            small
            success
            pressOnEnter
            style={[styles.w100]}
        />
    );
}

ActionCell.displayName = 'ActionCell';

export default ActionCell;
