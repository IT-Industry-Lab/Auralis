import { forwardRef, ElementType } from 'react';
import { Slot } from '@radix-ui/react-slot';
import styles from './card.module.scss';
import {
  CardBodyProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  PolymorphicComponent,
} from './card.props';

const CardRoot = forwardRef(
  <C extends ElementType = 'div'>(
    { className, asChild = false, as, ...props }: CardProps<C>,
    ref: any
  ) => {
    const Component: ElementType = asChild ? Slot : as || 'div';
    return <Component ref={ref} className={`${styles.card} ${className || ''}`} {...props} />;
  }
) as PolymorphicComponent<'div'>;

CardRoot.displayName = 'Card';

const CardHeader = forwardRef(
  <C extends ElementType = 'div'>(
    { className, asChild = false, as, ...props }: CardHeaderProps<C>,
    ref: any
  ) => {
    const Component: ElementType = asChild ? Slot : as || 'div';
    return <Component ref={ref} className={`${styles.header} ${className || ''}`} {...props} />;
  }
) as PolymorphicComponent<'div'>;

const CardBody = forwardRef(
  <C extends ElementType = 'div'>(
    { className, asChild = false, as, ...props }: CardBodyProps<C>,
    ref: any
  ) => {
    const Component: ElementType = asChild ? Slot : as || 'div';
    return <Component ref={ref} className={`${styles.body} ${className || ''}`} {...props} />;
  }
) as PolymorphicComponent<'div'>;


const CardFooter = forwardRef(
  <C extends ElementType = 'div'>(
    { className, asChild = false, as, ...props }: CardFooterProps<C>,
    ref: any
  ) => {
    const Component: ElementType = asChild ? Slot : as || 'div';
    return <Component ref={ref} className={`${styles.footer} ${className || ''}`} {...props} />;
  }
) as PolymorphicComponent<'div'>;


// names
CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';

// compact
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
